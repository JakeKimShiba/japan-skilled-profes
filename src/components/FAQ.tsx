import { useI18n } from '@/i18n';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FAQ() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{t('faq.title')}</CardTitle>
          <CardDescription>{t('faq.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {/* FAQ 1: 고도인재 비자란? */}
            <AccordionItem value="what-is-hsp">
              <AccordionTrigger className="text-left">
                <span className="font-semibold">{t('faq.q1.question')}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>{t('faq.q1.answer1')}</p>
                <p>{t('faq.q1.answer2')}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">{t('faq.q1.benefit1')}</Badge>
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">{t('faq.q1.benefit2')}</Badge>
                  <Badge variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">{t('faq.q1.benefit3')}</Badge>
                  <Badge variant="default" className="bg-amber-600 hover:bg-amber-700 text-white">{t('faq.q1.benefit4')}</Badge>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* FAQ 2: 70점 달성 방법 */}
            <AccordionItem value="how-to-70">
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

            {/* FAQ 3: JLPT 차이 */}
            <AccordionItem value="jlpt-difference">
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

            {/* FAQ 4: 학력별 점수 */}
            <AccordionItem value="education-points">
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

            {/* FAQ 5: 연봉 요구사항 */}
            <AccordionItem value="salary-requirement">
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
                <p className="font-medium mt-4">점수 구간:</p>
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

            {/* FAQ 6: 경력 인정 */}
            <AccordionItem value="work-experience">
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

            {/* FAQ 7: 80점 이상 혜택 */}
            <AccordionItem value="80-points-benefit">
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

            {/* FAQ 8: 대학 가산점 */}
            <AccordionItem value="university-bonus">
              <AccordionTrigger className="text-left">
                <span className="font-semibold">{t('faq.q8.question')}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>{t('faq.q8.answer1')}</p>
                <p>{t('faq.q8.answer2')}</p>
                <Badge variant="outline" className="mt-2">+10{t('points.unit')}</Badge>
              </AccordionContent>
            </AccordionItem>

            {/* FAQ 9: 외국 자격/국제 수상 */}
            <AccordionItem value="foreign-qualifications">
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

            {/* FAQ 10: 영주권 반려 사유 */}
            <AccordionItem value="pr-rejection">
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

            {/* Q11: Multiple Degrees */}
            <AccordionItem value="item-11">
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

            {/* Q12: Salary/Compensation Definition */}
            <AccordionItem value="item-12">
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
          </Accordion>
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
            }
          ]
        })
      }} />
    </div>
  );
}
