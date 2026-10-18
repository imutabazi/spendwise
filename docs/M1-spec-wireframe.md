# M1- spec,wireframes and accessibility plan

## Data model 
- Each record has : id(like rec_0001),description, amount,category,date (YYYY-MM-DD), createdAt and updatedAt
- Amounts are stored in base currency
- Settings store : base currency, two other currencies with manual rates , spending cap and category list

## Wireframes
Sketches are described below"
- Dashboard : three stat boxes (records,total,top category), cap message, and a 7 day bar chart
- Records: search box, ignore case checkbox , sort dropdown, then a table on desktop / cards on mobile 
- Add form : decription , amount , category, date , save button 
- Settings : currencies and rates , cap , categories , import/export
- About: purpose and contact links 
Layout : one column on mobile wider layouts at 768px and 1024px 

## Accessibility plan
- Landmarks : header, nav, main, section, footer, with one h1
- Skip-to-content link at the top
- Every input has a lable; errors are shown as text, not just colour
- Status and cap messages use aria-live regions 
- Everything works iwht keyboard with visible focus outline
- Text contrast of at least 4.5:1
- Animations are turned off for reduced-motion users 
