# Japan Highly Skilled Professional Visa Points Calculator - PRD

## Core Purpose & Success
- **Mission Statement**: A calculator that helps foreign professionals quickly assess their eligibility for Japan's highly skilled professional visa by calculating their points based on official criteria.
- **Success Indicators**: Users accurately determine their visa eligibility status and understand which factors contribute to their score.
- **Experience Qualities**: Accessible, Intuitive, Informative

## Project Classification & Approach
- **Complexity Level**: Light Application (multiple features with basic state)
- **Primary User Activity**: Acting (inputting information to receive calculated results)

## Thought Process for Feature Selection
- **Core Problem Analysis**: Foreign professionals struggle to understand whether they qualify for Japan's preferential immigration status and how to maximize their points.
- **User Context**: Users will engage with this calculator when considering a move to Japan or changing their visa status while already in Japan.
- **Critical Path**: Enter personal information → Receive calculated point total → Review visa eligibility and benefits
- **Key Moments**: 
  1. Inputting professional credentials and seeing real-time point calculation
  2. Discovering which categories contribute most to their points total
  3. Learning about visa benefits based on their calculated score

## Essential Features
1. **Interactive Point Calculator Form**
   - What: Form with inputs for education, work experience, age, salary, language skills, etc.
   - Why: Enables users to input their personal data for accurate assessment
   - Success: Users can easily fill in all fields without confusion or errors

2. **Real-time Point Calculation with Per-Item Points Display**
   - What: Dynamic calculation showing current point total as users input data, with points shown next to each option
   - Why: Provides immediate feedback and helps users understand how each factor affects their score
   - Success: Points update correctly and visibly when any input changes, and users can easily see the point value of each option

3. **Results Summary & Eligibility Explanation**
   - What: Clear breakdown of points earned in each category and eligibility status
   - Why: Helps users understand their qualification status and which areas they could improve
   - Success: Users clearly understand if they qualify and why/why not

4. **Information Panel**
   - What: Explanatory content about the visa program, benefits, and requirements
   - Why: Educates users about the visa system and its advantages
   - Success: Users gain sufficient understanding of the visa program's purpose and benefits

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Confidence, clarity, professionalism
- **Design Personality**: Clean, official, helpful
- **Visual Metaphors**: Stepping stones, scales, checklist
- **Simplicity Spectrum**: Minimalist interface with focus on clarity and ease of use

### Color Strategy
- **Color Scheme Type**: Monochromatic with accent color
- **Primary Color**: Blue (#4361ee) - represents professionalism, trust, reliability
- **Secondary Colors**: Light blue (#4895ef) - supporting color for UI elements
- **Accent Color**: Red (#e63946) - for highlighting important information and call-to-action elements
- **Color Psychology**: Blue instills trust and professionalism suitable for an immigration tool
- **Color Accessibility**: All color combinations meet WCAG AA standards with sufficient contrast
- **Foreground/Background Pairings**: 
  - Background (#ffffff) with Foreground text (#1a1a1a) - 15:1 contrast ratio
  - Primary (#4361ee) with white text (#ffffff) - 4.5:1 contrast ratio
  - Card (#f8f9fa) with text (#1a1a1a) - 14:1 contrast ratio
  - Accent (#e63946) with white text (#ffffff) - 4.5:1 contrast ratio

### Typography System
- **Font Pairing Strategy**: Sans-serif heading font with highly readable body text
- **Typographic Hierarchy**: Clear distinction between section titles, form labels, and results
- **Font Personality**: Clean, modern, accessible
- **Readability Focus**: Generous spacing and clear form labels for easy scanning
- **Typography Consistency**: Consistent type scale throughout the application
- **Which fonts**: 'Noto Sans JP' for multilingual support (Japanese/English/Korean) with 'Open Sans' as fallback
- **Legibility Check**: Both fonts have excellent legibility at various sizes and support all required languages

### Visual Hierarchy & Layout
- **Attention Direction**: Form fields are prominently displayed with clear grouping
- **White Space Philosophy**: Liberal use of white space to create visual breathing room
- **Grid System**: Card-based layout with clear section separation
- **Responsive Approach**: Stack elements vertically on mobile, side-by-side on desktop
- **Content Density**: Low to medium density with focus on clarity over compactness

### Animations
- **Purposeful Meaning**: Subtle transitions when updating point totals
- **Hierarchy of Movement**: Focus on result updates with minimal movement elsewhere
- **Contextual Appropriateness**: Simple fade-ins for results, no distracting animations

### UI Elements & Component Selection
- **Component Usage**: Cards for content sections, form inputs for data collection, progress indicators for score visualization
- **Component Customization**: Light shadows on cards for depth, rounded corners for approachability
- **Component States**: Clear hover and focus states on all interactive elements
- **Icon Selection**: Simple, intuitive icons for category headers
- **Component Hierarchy**: Form sections > Individual inputs > Helper text
- **Spacing System**: Consistent padding using Tailwind's spacing scale
- **Mobile Adaptation**: Full-width cards on mobile, multi-column on desktop

### Visual Consistency Framework
- **Design System Approach**: Component-based design with consistent styling
- **Style Guide Elements**: Typography, color palette, form elements
- **Visual Rhythm**: Consistent spacing and alignment throughout
- **Brand Alignment**: Professional appearance suitable for immigration matters

### Accessibility & Readability
- **Contrast Goal**: WCAG AA compliance for all text and interactive elements

## Edge Cases & Problem Scenarios
- **Potential Obstacles**: Users may not understand specific visa terminology or point criteria
- **Edge Case Handling**: Tooltips explaining technical terms, helpful validation messages
- **Technical Constraints**: Ensuring calculations match official immigration criteria

## Implementation Considerations
- **Scalability Needs**: Potential to add multiple visa types or update point criteria if regulations change
- **Testing Focus**: Verify calculation accuracy against official examples
- **Critical Questions**: How frequently do visa point criteria change? Should the app store user data?

## Reflection
- This solution uniquely combines official information with an intuitive calculator, making complex visa requirements accessible
- We've assumed users have basic information about their qualifications readily available
- Making this exceptional would involve providing personalized recommendations for improving points in specific categories