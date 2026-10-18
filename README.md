## SpendWise - Student Finance Tracker 

Theme : Student Finance Tracker 
Live site : 
Demo video : 
Author : Innocente Mutabazi Umuhuza (Github: imutabazi, i.mutabazi@alustudent.com)


## Features

- Dashboard with totals,top category, 7day chart and spendig cap 
- Records table (card on mobile) with sorting 
- Live regex search with highlighting and a case toggle 
- Add form with inline validation , inline edit , and confirmed delete
- Settings for currencies , cap and categories 
- Saves for localStorage; JSON import and export with validation 

### Regex catalog 
- Description : ^(?!.*\s{2})\S(?:.*\S)?$
Valid : Lunch at cafeteria , Invalid : "hi", "a  b"
- Amount : ^(0|[1-9]\d*)(\.\d{1,2})?$
 Valid : 12.50 , Invalid : 012,1.234
- Date : ^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$
  Valid : 2024-02-29 Invalid: 2025-13-01
- Category: ^[A-Za-z]+(?:[ -][A-Za-z]+)*$
 Valid: Fast-food Invalid:Food 2
- Duplicate word (back-reference):\b(\w+)\s+\1\b
  Matches: "coffee coffee"
- Search examples: \.\d{2}\b (cents), (coffee|tea), ^Lunch

## Keyboard map 

- Tab/Shift+Tab : move between controls 
- Enter : follow links , press buttons, submit forms
- Space: toggle the ignore-case checkbox
- Arrow keys: change a dropdown
- The first Tab shows the skip-to-content link 
  
## Accessibility notes 

- Semantic landmarks and heading order 
- Labels on all inputs, errors linked with aria-describedby
- aria-live for status and cap messages (polite when under, assertive when over)
- Visible focus , good contrast and reduced motion support 

## How to run 
`python3 -m http.server 8000` , then open `http://localhost:8000`
Tests: open `http://localhost:8000/tests.html`