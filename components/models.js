import variants from './product-variants.json';
import legacyModels from './legacy-models.json';

// Model capacities; shop stock and pricing still require confirmation.
const storageOptions = {
  pro: ['256GB', '512GB', '1TB', '2TB'],
  air: ['256GB', '512GB', '1TB'],
  standard: ['256GB', '512GB'],
  duo: ['256GB', '512GB', '1TB', '2TB'],
  '17e': ['256GB', '512GB'],
  '16': ['128GB', '256GB', '512GB'],
};

const currentModels = [{name:'iPhone 18 Pro',family:'Pro',image:'pro',copy:'For the big ideas. And the smallest details.',colors:['#57303a','#cbdde6','#dddcd8','#353535'],detail:'Explore the Pro collection, with a focus on creative photography and performance. Confirm storage, finish, price, and availability with Darlin.'},{name:'iPhone Air',family:'Air',image:'air',copy:'A lighter touch. A beautiful way to do more.',colors:['#cbdfe8','#e9e2cf','#ecebe7','#252525'],detail:'Explore a light, slim iPhone design. Ask Darlin about available finishes and storage options before choosing your model.'},{name:'iPhone 17',family:'Everyday',image:'standard',copy:'Everyday magic. In a colour that feels like you.',colors:['#b9afd2','#bccbb4','#d1dfeb','#eeeae2','#353535'],detail:'Explore the everyday iPhone collection and find a finish that suits your style. Pricing and available configurations require confirmation.'},
{name:'iPhone Duo', family:'Duo', image:'duo', copy:'A new perspective. More room for your world.', colors:['#efede6','#3d4650'], detail:'Explore the foldable iPhone Duo. Confirm availability, finish, storage, and pricing with Darlin.'},
{name:'iPhone 17e', family:'Everyday', image:'17e', copy:'Your everyday essentials. Beautifully together.', colors:['#e9ccd0','#ecebe7','#262626'], detail:'Explore iPhone 17e and find the right fit for your everyday needs. Ask Darlin for available configurations and current pricing.'},
{name:'iPhone 16', family:'Everyday', image:'16', copy:'Full of colour. Ready for your everyday.', colors:['#5865a9','#9dbdb6','#e6a9c6','#ecebe7','#262626'], detail:'Explore iPhone 16. Confirm available finishes, storage options, condition, and current pricing with Darlin.'}
];

// Older generations are kept in a separate data file for straightforward stock updates.

export const models = [...currentModels, ...legacyModels].map(model => ({
  ...model,
  generation: model.name.match(/iPhone (\d+)/)?.[1] || model.family,
  variants: variants[model.image] || [],
  storageOptions: model.storageOptions || storageOptions[model.image] || [],
}));
