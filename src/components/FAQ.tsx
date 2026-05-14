import { useState } from 'react';
import { useI18n } from '@/i18n';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FAQCategory = 'all' | 'basics' | 'education' | 'salary' | 'experience' | 'language' | 'qualifications' | 'pr';

interface FAQItemData {
  id: string;
  value: string;
  category: FAQCategory;
}

export function FAQ() {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('all');

  // FAQ 항목 메타데이터
  const faqItems: FAQItemData[] = [
    { id: 'q1', value: 'what-is-hsp', category: 'basics' },
    { id: 'q2', value: 'how-to-70', category: 'basics' },
    { id: 'q7', value: '80-points-benefit', category: 'basics' },
    { id: 'q4', value: 'education-points', category: 'education' },
    { id: 'q8', value: 'university-bonus', category: 'education' },
    { id: 'q11', value: 'item-11', category: 'education' },
    { id: 'q14', value: 'item-14', category: 'education' },
    { id: 'q5', value: 'salary-requirement', category: 'salary' },
    { id: 'q12', value: 'item-12', category: 'salary' },
    { id: 'q6', value: 'work-experience', category: 'experience' },
    { id: 'q3', value: 'jlpt-difference', category: 'language' },
    { id: 'q9', value: 'foreign-qualifications', category: 'qualifications' },
    { id: 'q13', value: 'item-13', category: 'qualifications' },
    { id: 'q10', value: 'pr-rejection', category: 'pr' },
  ];

  const filteredItems = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  const categories: { key: FAQCategory; icon: string }[] = [
    { key: 'all', icon: '📋' },
    { key: 'basics', icon: '📌' },
    { key: 'education', icon: '🎓' },
    { key: 'salary', icon: '💰' },
    { key: 'experience', icon: '💼' },
    { key: 'language', icon: '🗣️' },
    { key: 'qualifications', icon: '📜' },
    { key: 'pr', icon: '🏠' },
  ];

  const renderFAQContent = (itemId: string) => {
    switch (itemId) {
      case 'q1':
        return (
          <AccordionItem value="what-is-hsp" key="what-is-hsp">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q1.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3">
              <p>{t('faq.q1.answer1')}</p>
              <p>{t('faq.q1.answer2')}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary" className="text-primary">{t('faq.q1.benefit1')}</Badge>
                <Badge variant="secondary" className="text-primary">{t('faq.q1.benefit2')}</Badge>
                <Badge variant="secondary" className="text-primary">{t('faq.q1.benefit3')}</Badge>
                <Badge variant="secondary" className="text-primary">{t('faq.q1.benefit4')}</Badge>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q2':
        return (
          <AccordionItem value="how-to-70" key="how-to-70">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q2.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3">
              <p>{t('faq.q2.answer1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>{t('faq.q2.tip1.title')}</strong>: {t('faq.q2.tip1.desc')}</li>
                <li><strong>{t('faq.q2.tip2.title')}</strong>: {t('faq.q2.tip2.desc')}</li>
                <li><strong>{t('faq.q2.tip3.title')}</strong>: {t('faq.q2.tip3.desc')}</li>
                <li><strong>{t('faq.q2.tip4.title')}</strong>: {t('faq.q2.tip4.desc')}</li>
                <li><strong>{t('faq.q2.tip5.title')}</strong>: {t('faq.q2.tip5.desc')}</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q3':
        return (
          <AccordionItem value="jlpt-difference" key="jlpt-difference">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q3.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">JLPT N1</h4>
                  <p className="text-sm mb-2">{t('faq.q3.n1.desc')}</p>
                  <Badge className="bg-blue-600">+15{t('points.unit')}</Badge>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">JLPT N2</h4>
                  <p className="text-sm mb-2">{t('faq.q3.n2.desc')}</p>
                  <Badge className="bg-green-600">+10{t('points.unit')}</Badge>
                </div>
              </div>
              <p className="mt-3">{t('faq.q3.recommendation')}</p>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q4':
        return (
          <AccordionItem value="education-points" key="education-points">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q4.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
                  <span>{t('faq.q4.doctorate')}</span>
                  <Badge variant="default">30{t('points.unit')}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
                  <span>{t('faq.q4.masters')}</span>
                  <Badge variant="default">20{t('points.unit')}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
                  <span>{t('faq.q4.bachelors')}</span>
                  <Badge variant="secondary">10{t('points.unit')}</Badge>
                </div>
                <p className="text-sm mt-4">{t('faq.q4.note')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q5':
        return (
          <AccordionItem value="salary-requirement" key="salary-requirement">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q5.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3">
              <p>{t('faq.q5.answer1')}</p>
              <div className="space-y-2 mt-3 mb-4">
                <div className="p-3 bg-red-50 dark:bg-red-950 border-l-4 border-red-500 rounded">
                  <p className="text-sm font-semibold text-red-900 dark:text-red-100">{t('faq.q5.technical')}</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950 border-l-4 border-purple-500 rounded">
                  <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">{t('faq.q5.business')}</p>
                </div>
              </div>
              <p className="font-medium mt-4">{t('faq.q5.salaryRanges') || '점수 구간:'}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-950 rounded">
                  <span>{t('faq.q5.salary1')}</span>
                  <Badge className="bg-amber-600">40{t('points.unit')}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950 rounded">
                  <span>{t('faq.q5.salary2')}</span>
                  <Badge className="bg-orange-600">30{t('points.unit')}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded">
                  <span>{t('faq.q5.salary3')}</span>
                  <Badge className="bg-blue-600">20{t('points.unit')}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded">
                  <span>{t('faq.q5.salary4')}</span>
                  <Badge className="bg-green-600">10{t('points.unit')}</Badge>
                </div>
              </div>
              <p className="text-sm mt-4">{t('faq.q5.note')}</p>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q6':
        return (
          <AccordionItem value="work-experience" key="work-experience">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q6.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3">
              <p>{t('faq.q6.answer1')}</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>{t('faq.q6.req1')}</li>
                <li>{t('faq.q6.req2')}</li>
                <li>{t('faq.q6.req3')}</li>
              </ul>
              <p className="mt-3">{t('faq.q6.answer2')}</p>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q7':
        return (
          <AccordionItem value="80-points-benefit" key="80-points-benefit">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q7.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3">
              <p>{t('faq.q7.answer1')}</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-2">{t('faq.q7.standard.title')}</h4>
                  <p className="text-sm">{t('faq.q7.standard.desc')}</p>
                </div>
                <div className="p-4 border-2 border-amber-500 rounded-lg bg-amber-50 dark:bg-amber-950">
                  <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2">{t('faq.q7.expedited.title')}</h4>
                  <p className="text-sm">{t('faq.q7.expedited.desc')}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q8':
        return (
          <AccordionItem value="university-bonus" key="university-bonus">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q8.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3">
              <p>{t('faq.q8.answer1')}</p>
              <p>{t('faq.q8.answer2')}</p>
              <Badge variant="outline" className="mt-2">+10{t('points.unit')}</Badge>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q9':
        return (
          <AccordionItem value="foreign-qualifications" key="foreign-qualifications">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q9.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3">
              <p>{t('faq.q9.answer1')}</p>
              <p className="font-semibold mt-4">{t('faq.q9.answer2')}</p>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual1')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual2')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual3')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual4')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual5')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual6')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual7')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual8')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual9')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual10')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual11')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual12')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual13')}</div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">{t('faq.q9.qual14')}</div>
              </div>
              <p className="text-sm mt-3">{t('faq.q9.note')}</p>
              <Badge variant="outline" className="mt-2">+5{t('points.unit')}</Badge>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q10':
        return (
          <AccordionItem value="pr-rejection" key="pr-rejection">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q10.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3">
              <p>{t('faq.q10.answer1')}</p>
              <ul className="list-none space-y-3 mt-4">
                <li className="p-3 bg-red-50 dark:bg-red-950 border-l-4 border-red-500 rounded">
                  <strong className="text-red-900 dark:text-red-100">{t('faq.q10.reason1.title')}</strong>
                  <p className="text-sm mt-1">{t('faq.q10.reason1.desc')}</p>
                </li>
                <li className="p-3 bg-orange-50 dark:bg-orange-950 border-l-4 border-orange-500 rounded">
                  <strong className="text-orange-900 dark:text-orange-100">{t('faq.q10.reason2.title')}</strong>
                  <p className="text-sm mt-1">{t('faq.q10.reason2.desc')}</p>
                </li>
                <li className="p-3 bg-purple-50 dark:bg-purple-950 border-l-4 border-purple-500 rounded">
                  <strong className="text-purple-900 dark:text-purple-100">{t('faq.q10.reason3.title')}</strong>
                  <p className="text-sm mt-1">{t('faq.q10.reason3.desc')}</p>
                </li>
                <li className="p-3 bg-gray-50 dark:bg-gray-900 border-l-4 border-gray-400 rounded">
                  <strong>{t('faq.q10.reason4.title')}</strong>
                  <p className="text-sm mt-1">{t('faq.q10.reason4.desc')}</p>
                </li>
              </ul>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg mt-4">
                <strong className="text-blue-900 dark:text-blue-100">{t('faq.q10.solution.title')}</strong>
                <p className="text-sm mt-2">{t('faq.q10.solution.desc')}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q11':
        return (
          <AccordionItem value="item-11" key="item-11">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q11.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3">
              <p>{t('faq.q11.answer1')}</p>
              <ul className="list-none space-y-3 mt-4">
                <li className="p-3 bg-green-50 dark:bg-green-950 border-l-4 border-green-500 rounded">
                  <strong className="text-green-900 dark:text-green-100">{t('faq.q11.point1.title')}</strong>
                  <p className="text-sm mt-1">{t('faq.q11.point1.desc')}</p>
                </li>
                <li className="p-3 bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500 rounded">
                  <strong className="text-amber-900 dark:text-amber-100">{t('faq.q11.point2.title')}</strong>
                  <p className="text-sm mt-1">{t('faq.q11.point2.desc')}</p>
                </li>
                <li className="p-3 bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 rounded">
                  <strong className="text-blue-900 dark:text-blue-100">{t('faq.q11.point3.title')}</strong>
                  <p className="text-sm mt-1">{t('faq.q11.point3.desc')}</p>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q12':
        return (
          <AccordionItem value="item-12" key="item-12">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q12.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-4">
              <p>{t('faq.q12.answer1')}</p>
              
              {/* Included Items */}
              <div className="mt-4">
                <h4 className="font-semibold text-foreground mb-2">{t('faq.q12.included.title')}</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>{t('faq.q12.included.item1')}</li>
                  <li>{t('faq.q12.included.item2')}</li>
                  <li>{t('faq.q12.included.item3')}</li>
                  <li>{t('faq.q12.included.item4')}</li>
                  <li>{t('faq.q12.included.item5')}</li>
                </ul>
              </div>

              {/* Excluded Items */}
              <div className="mt-4">
                <h4 className="font-semibold text-foreground mb-2">{t('faq.q12.excluded.title')}</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>{t('faq.q12.excluded.item1')}</li>
                  <li>{t('faq.q12.excluded.item2')}</li>
                  <li>{t('faq.q12.excluded.item3')}</li>
                </ul>
              </div>

              {/* Recognition Criteria */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg mt-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{t('faq.q12.criteria.title')}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>{t('faq.q12.criteria.desc1')}</li>
                  <li>{t('faq.q12.criteria.desc2')}</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q13':
        return (
          <AccordionItem value="item-13" key="item-13">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q13.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-4">
              <p>{t('faq.q13.answer1')}</p>
              
              {/* Recognition Details */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  <span>{t('faq.q13.recognition1')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  <span>{t('faq.q13.recognition2')}</span>
                </div>
              </div>

              <p>{t('faq.q13.answer2')}</p>

              {/* Important Notes */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg mt-4">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">{t('faq.q13.note.title')}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>{t('faq.q13.note1')}</li>
                  <li>{t('faq.q13.note2')}</li>
                </ul>
              </div>

              {/* IPA Link */}
              <div className="mt-4">
                <a 
                  href="https://www.ipa.go.jp/shiken/asia/mutual-recognition/korea.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors underline"
                >
                  {t('faq.q13.link')}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      case 'q14':
        return (
          <AccordionItem value="item-14" key="item-14">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">{t('faq.q14.question')}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-4">
              <p>{t('faq.q14.answer1')}</p>
              <p>{t('faq.q14.answer2')}</p>
              <p>{t('faq.q14.answer3')}</p>

              {/* Recognition Criteria */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg mt-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{t('faq.q14.criteria.title')}</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>{t('faq.q14.criteria.activity')}</li>
                  <li>{t('faq.q14.criteria.content')}</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{t('faq.title')}</CardTitle>
          <CardDescription>{t('faq.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as FAQCategory)} className="mb-6">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
              {categories.map(({ key, icon }) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 data-[state=active]:bg-background"
                >
                  <span className="mr-1">{icon}</span>
                  <span className="hidden sm:inline">{t(`faq.category.${key}`)}</span>
                  <span className="sm:hidden">{t(`faq.category.${key}`).slice(0, 2)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* FAQ Items */}
          <Accordion type="single" collapsible className="w-full">
            {filteredItems.map((item) => renderFAQContent(item.id))}
          </Accordion>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t('faq.noResults') || '해당 카테고리에 질문이 없습니다.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schema.org FAQPage structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": t('faq.q1.question'),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t('faq.q1.answer1') + ' ' + t('faq.q1.answer2')
              }
            },
            {
              "@type": "Question",
              "name": t('faq.q2.question'),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t('faq.q2.answer1')
              }
            },
            {
              "@type": "Question",
              "name": t('faq.q3.question'),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t('faq.q3.n1.desc') + ' ' + t('faq.q3.n2.desc')
              }
            },
            {
              "@type": "Question",
              "name": t('faq.q4.question'),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t('faq.q4.doctorate') + ': 30' + t('points.unit') + ', ' + t('faq.q4.masters') + ': 20' + t('points.unit') + ', ' + t('faq.q4.bachelors') + ': 10' + t('points.unit')
              }
            },
            {
              "@type": "Question",
              "name": t('faq.q5.question'),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t('faq.q5.answer1')
              }
            },
            {
              "@type": "Question",
              "name": t('faq.q6.question'),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t('faq.q6.answer1') + ' ' + t('faq.q6.answer2')
              }
            },
            {
              "@type": "Question",
              "name": t('faq.q7.question'),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t('faq.q7.answer1') + ' ' + t('faq.q7.standard.desc') + ' ' + t('faq.q7.expedited.desc')
              }
            },
            {
              "@type": "Question",
              "name": t('faq.q8.question'),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t('faq.q8.answer1') + ' ' + t('faq.q8.answer2')
              }
            },
            {
              "@type": "Question",
              "name": t('faq.q9.question'),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t('faq.q9.answer1') + ' ' + t('faq.q9.answer2')
              }
            },
            {
              "@type": "Question",
              "name": t('faq.q14.question'),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t('faq.q14.answer1') + ' ' + t('faq.q14.answer2') + ' ' + t('faq.q14.answer3')
              }
            }
          ]
        })
      }} />
    </div>
  );
}
