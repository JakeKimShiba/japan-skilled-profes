const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function loadAnalytics(env = { PROD: true, VITE_GA_MEASUREMENT_ID: 'G-TEST' }) {
  const scripts = [];
  const context = vm.createContext({
    exports: {},
    URL,
    testEnv: env,
    location: new URL('https://kodocalc.com/?lang=ko&bd=1997-01-01&s=8m#results'),
    document: {
      referrer: 'https://kodocalc.com/guide?bd=1997-01-01&s=8m#results',
      getElementById: id => scripts.find(script => script.id === id),
      createElement: () => ({}),
      head: {
        appendChild(script) {
          scripts.push(script);
          script.queuedBeforeLoad = JSON.parse(JSON.stringify(context.dataLayer || []));
          if (script.innerHTML) vm.runInContext(script.innerHTML, context);
        },
      },
    },
  });
  context.window = context;
  const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'analytics.ts'), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    transformers: {
      before: [context => source => {
        const visit = node => {
          if (ts.isPropertyAccessExpression(node) && node.name.text === 'env' && ts.isMetaProperty(node.expression)) {
            return ts.factory.createIdentifier('testEnv');
          }
          return ts.visitEachChild(node, visit, context);
        };
        return ts.visitNode(source, visit);
      }],
    },
  });
  vm.runInContext(outputText, context);
  return { analytics: context.exports, context, scripts };
}

test('Analytics queues sanitized defaults before the external tag can load, including the first pageview', () => {
  const { analytics, context, scripts } = loadAnalytics();
  analytics.initAnalytics();
  analytics.initAnalytics();
  assert.equal(scripts.filter(script => script.id === 'ga4-gtag').length, 1);
  const queued = scripts.find(script => script.id === 'ga4-gtag').queuedBeforeLoad;
  const defaults = queued.find(command => command[0] === 'set')?.[1];
  const config = queued.find(command => command[0] === 'config')?.[2];
  for (const params of [defaults, config]) {
    assert.equal(params?.page_location, 'https://kodocalc.com/');
    assert.equal(params?.page_path, '/');
    assert.equal(params?.page_referrer, 'https://kodocalc.com/guide');
  }
  assert.equal(config.send_page_view, true);
  assert.equal(context.dataLayer.filter(command => command[0] === 'config').length, 1);
});

test('Analytics events and explicit pageviews strip query, fragment and URL credentials without changing sharing', () => {
  const { analytics, context } = loadAnalytics();
  analytics.initAnalytics();
  context.location = new URL('https://kodocalc.com/guide?bd=1980-01-01&s=7m#private');
  context.document.referrer = 'https://name:password@example.com/source?bd=1997-01-01#private';
  analytics.trackEvent('calculation_completed', {
    total_points: 65,
    qualified: false,
    page_location: context.location.href,
    page_referrer: context.document.referrer,
    page_path: '/?bd=1997-01-01',
  });
  analytics.trackPageView('/guide/article?bd=1997-01-01&s=8m#private');
  const events = context.dataLayer.filter(command => command[0] === 'event');
  assert.equal(events[0][2].page_location, 'https://kodocalc.com/guide');
  assert.equal(events[0][2].page_path, '/guide');
  assert.equal(events[0][2].page_referrer, 'https://example.com/source');
  assert.equal(events[0][2].total_points, 65);
  assert.equal(events[0][2].qualified, false);
  assert.equal(events[1][2].page_location, 'https://kodocalc.com/guide/article');
  assert.equal(events[1][2].page_path, '/guide/article');
  assert.equal(context.location.search, '?bd=1980-01-01&s=7m');
});

test('Analytics handles absent or invalid referrers and refuses non-HTTP pageview overrides', () => {
  const { analytics, context } = loadAnalytics();
  analytics.initAnalytics();
  for (const referrer of ['', 'not a URL', 'javascript:alert(1)']) {
    context.document.referrer = referrer;
    analytics.trackPageView('javascript:alert(1)');
    const params = context.dataLayer.at(-1)[2];
    assert.equal(params.page_location, 'https://kodocalc.com/');
    assert.equal(params.page_referrer, '');
  }
});

test('Analytics stays disabled in development or without a measurement ID', () => {
  for (const env of [{ PROD: false, VITE_GA_MEASUREMENT_ID: 'G-TEST' }, { PROD: true }]) {
    const { analytics, context, scripts } = loadAnalytics(env);
    analytics.initAnalytics();
    assert.equal(scripts.length, 0);
    if (!env.PROD) {
      const calls = [];
      context.gtag = (...args) => calls.push(args);
      analytics.trackPageView('/guide');
      analytics.trackEvent('test');
      assert.equal(calls.length, 0);
    }
  }
});
