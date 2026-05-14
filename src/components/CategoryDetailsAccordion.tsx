import { PointsData } from "@/lib/models";
import { useI18n } from "@/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface CategoryDetailsAccordionProps {
  data: PointsData;
  categoryPoints: Record<string, number>;
  expandAll?: boolean;
}

export function CategoryDetailsAccordion({ data, categoryPoints, expandAll }: CategoryDetailsAccordionProps) {
  const { t } = useI18n();

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'academic':
        return t('category.academic');
      case 'career':
        return t('category.career');
      case 'age':
        return t('category.age');
      case 'salary':
        return t('category.salary');
      case 'research':
        return t('category.research');
      case 'license':
        return t('category.license');
      case 'language':
        return t('category.language');
      case 'special':
        return t('category.special');
      default:
        return category;
    }
  };

  const getEducationLabel = (level: string) => {
    switch(level) {
      case 'doctorate': return t('education.doctorate');
      case 'masters': return t('education.masters');
      case 'mba': return t('education.mba');
      case 'bachelors': return t('education.bachelors');
      case 'associate': return t('education.associate');
      case 'none': return t('education.none');
      default: return level;
    }
  };

  const getExperienceLabel = (exp: string) => {
    switch(exp) {
      case 'less3': return t('work.less3');
      case '3to5': return t('work.3to5');
      case '5to7': return t('work.5to7');
      case '7to10': return t('work.7to10');
      case '10plus': return t('work.10plus');
      case '7plus': return t('work.7plus');
      default: return exp;
    }
  };

  const getAgeLabel = (age: string) => {
    switch(age) {
      case '29under': return t('age.29under');
      case '30to34': return t('age.30to34');
      case '35to39': return t('age.35to39');
      case '40plus': return t('age.40plus');
      default: return age;
    }
  };

  const getSalaryLabel = (salary: string) => {
    switch(salary) {
      case 'under3m': return t('salary.under3m');
      case 'under5m': return t('salary.level.under5m');
      case 'under6m': return t('salary.level.under6m');
      case 'under8m': return t('salary.level.under8m');
      case 'under10m': return t('salary.under10m');
      case '4m': return t('salary.4m');
      case '5m': return t('salary.5m');
      case '6m': return t('salary.6m');
      case '7m': return t('salary.7m');
      case '8m': return t('salary.8m');
      case '9m': return t('salary.9m');
      case '10m': return t('salary.10m');
      case '15m': return t('salary.15m');
      case '20m': return t('salary.20m');
      case '25m': return t('salary.25m');
      case '30m': return t('salary.30m');
      case '3to5m': return t('salary.3to5m');
      case '3to6m': return t('salary.3to6m');
      case '3to8m': return t('salary.3to8m');
      default: return salary;
    }
  };

  const getLanguageLabel = (lang: string) => {
    switch(lang) {
      case 'jlpt-n1': return t('language.jlptN1');
      case 'jlpt-n2': return t('language.jlptN2');
      case 'bjt-480': return t('language.bjt480');
      case 'overseas_major': return t('language.overseasMajor');
      case 'none': return t('language.none');
      default: return lang;
    }
  };

  // Category detail renderers
  const renderAcademicDetails = () => {
    const items = [];
    
    if (data.educationLevel && data.educationLevel !== 'none') {
      items.push(getEducationLabel(data.educationLevel));
    }
    
    if (data.universityEligible && data.university) {
      items.push(`${data.university} (+10${t('points.unit')})`);
    }
    
    return items.length > 0 ? items : [t('result.categoryDetails.none')];
  };

  const renderCareerDetails = () => {
    if (data.workExperience && data.workExperience !== 'less3') {
      return [getExperienceLabel(data.workExperience)];
    }
    return [t('result.categoryDetails.none')];
  };

  const renderAgeDetails = () => {
    if (data.age) {
      return [getAgeLabel(data.age)];
    }
    return [t('result.categoryDetails.none')];
  };

  const renderSalaryDetails = () => {
    if (data.annualSalary) {
      return [getSalaryLabel(data.annualSalary)];
    }
    return [t('result.categoryDetails.none')];
  };

  const renderResearchDetails = () => {
    const items = [];
    
    if (data.researchAchievements && data.researchAchievements.length > 0) {
      data.researchAchievements.forEach(achievement => {
        switch(achievement) {
          case 'patent_invention':
            items.push(t('research.patents.detailed'));
            break;
          case 'official_journal':
            items.push(t('research.official.detailed'));
            break;
          case 'academic_database':
            items.push(t('research.papers.detailed'));
            break;
          case 'award_research':
            items.push(t('research.awards.detailed'));
            break;
          // Business visa research
          case 'management_record':
          case 'business_achievement':
          case 'company_growth':
          case 'innovation':
            items.push(t(`research.${achievement}`));
            break;
        }
      });
    }
    
    return items.length > 0 ? items : [t('result.categoryDetails.none')];
  };

  const renderLicenseDetails = () => {
    const items = [];
    
    if (data.licenses && data.licenses.length > 0) {
      data.licenses.forEach(license => {
        if (license === 'other') {
          items.push(t('license.foreign'));
        } else if (license === 'national') {
          items.push(t('license.japanese'));
        }
      });
    }
    
    if (data.jpNationalLicenses > 0) {
      items.push(`${t('license.japanese')} × ${data.jpNationalLicenses}`);
    }
    
    return items.length > 0 ? items : [t('result.categoryDetails.none')];
  };

  const renderLanguageDetails = () => {
    const items = [];
    
    if (data.japaneseLanguage && data.japaneseLanguage !== 'none') {
      items.push(getLanguageLabel(data.japaneseLanguage));
    }
    
    return items.length > 0 ? items : [t('result.categoryDetails.none')];
  };

  const renderSpecialDetails = () => {
    const items = [];
    
    if (data.japaneseEducation) {
      items.push(t('special.japaneseEducation'));
    }
    
    if (data.innovationBonus) {
      items.push(t('special.bonus.innovation'));
    }
    
    if (data.researchCostBonus) {
      items.push(t('special.bonus.researchCost'));
    }
    
    if (data.contractResearchBonus) {
      items.push(t('special.contractResearch'));
    }
    
    if (data.innovativeFieldBonus) {
      items.push(t('special.innovativeField'));
    }
    
    if (data.businessExecutiveBonus && data.businessExecutiveBonus !== 'none') {
      switch(data.businessExecutiveBonus) {
        case 'ceo':
          items.push(t('special.ceo'));
          break;
        case 'other':
          items.push(t('special.executive'));
          break;
      }
    }
    
    return items.length > 0 ? items : [t('result.categoryDetails.none')];
  };

  const categoryRenderers: Record<string, () => string[]> = {
    academic: renderAcademicDetails,
    career: renderCareerDetails,
    age: renderAgeDetails,
    salary: renderSalaryDetails,
    research: renderResearchDetails,
    license: renderLicenseDetails,
    language: renderLanguageDetails,
    special: renderSpecialDetails,
  };

  // Get badge color based on points
  const getBadgeStyle = (points: number) => {
    if (points === 0) {
      return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    } else if (points <= 10) {
      return "bg-blue-50 text-blue-700 hover:bg-blue-50";
    } else if (points <= 20) {
      return "bg-green-50 text-green-700 hover:bg-green-50";
    } else if (points <= 30) {
      return "bg-purple-50 text-purple-700 hover:bg-purple-50";
    } else {
      return "bg-amber-50 text-amber-700 hover:bg-amber-50";
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium mb-3">{t('result.categoryDetails.title')}</h3>
      <Accordion
        type="multiple"
        className="w-full"
        {...(expandAll ? { value: Object.keys(categoryPoints) } : {})}
      >
        {Object.entries(categoryPoints).map(([category, points]) => {
          const details = categoryRenderers[category]?.() || [t('result.categoryDetails.none')];
          
          return (
            <AccordionItem key={category} value={category} className="border rounded-lg mb-2 px-4">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="text-sm font-medium">{getCategoryLabel(category)}</span>
                  <Badge variant="outline" className={`ml-2 border-0 ${getBadgeStyle(points)}`}>
                    {points}{t('points.unit')}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="text-sm text-muted-foreground space-y-1 pt-2">
                  {details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      
    </div>
  );
}
