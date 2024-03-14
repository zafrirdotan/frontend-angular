import { IBotAction } from '../interfaces/grocery-bot';

type GetTextFunction = (action?: any) => string;
type GetAddTextFunction = (
  availableItems?: any,
  unavailableItems?: any
) => string;

export const responseDictionary: {
  [key in ResponseDictionary]: {
    he: (action?: any) => string;
    en: GetTextFunction | GetAddTextFunction;
  };
} = {
  introductionMessage: {
    he: () =>
      'שלום, אני עוזר הקניות שלך. תוכל לכתוב לי את רשימת הקניות שלך בטקסט פשוט ואני אוסיף אותה לעגלה שלך',
    en: () =>
      "Hi there! 👋 Welcome to our grocery store. I'm here to make your shopping experience as smooth and enjoyable as possible. Feel free to share your shopping list, add or remove specific products, or ask me anything about what we offer - be it product details, stock availability, or help with choosing the perfect item. If you're not sure where to start, just ask me about any product you have in mind. How can I assist you today?",
  },
  addingItemsToCart: {
    he: () => 'הפרטים נוספו לעגלה שלך',
    en: (availableItems, unavailableItems) => {
      if (availableItems?.length) {
        return `Sure! I have added the flowing items to your cart ${availableItems?.map(
          (item: any) => `\n- ${item.quantity} ${item.unit} ${item.name}`
        )}
                ${
                  unavailableItems?.length
                    ? `\nbut I could not find the following items ${unavailableItems.map(
                        (item: any) => `\n- ${item.name}`
                      )}`
                    : ''
                }`;
      } else if (unavailableItems?.length) {
        return `Sorry, I could not find the following items ${unavailableItems.map(
          (item: any) => `\n- ${item.name}`
        )}`;
      }
      return 'Sorry, I could not find the items you asked for';
    },
  },
  removingItemsFromCart: {
    he: () => 'הפרטים הוסרו מהעגלה שלך',
    en: () => 'Sure! I have removed the items to your cart!',
  },
  addingX: {
    he: (action: any) =>
      `לעגלת הקניות ${action?.list[0]?.name} ${action.quantity} נוספו עוד`, // problem
    en: (availableItems: any) =>
      `I have added the flowing items to your cart ${availableItems?.map(
        (item: any) => `\n- ${item.quantity} ${item.unit} ${item.name}`
      )}`,
  },
  addingBeMoreSpecific: {
    he: () => 'תוכל לפרט לאיזה מוצר אתה רוצה להוסיף',
    en: () => 'Sure but can you specify wat to add?',
  },
  removingX: {
    he: (action: any) =>
      `מעגלת הקניות ${action?.list[0]?.name} ${action.list[0]?.quantity} הוסרו`,
    en: (action: any) =>
      `I have removed ${action.list[0]?.quantity} ${action?.list[0]?.name} from the cart`,
  },
  removingBeMoreSpecific: {
    he: () => 'תוכל לפרט לאיזה מוצר אתה רוצה להוריד',
    en: () => 'Sure but can you specify wat to remove?',
  },
  sayingHallo: {
    he: () => 'שלום! איך אוכל לעזור לך?',
    en: () => 'Hi How can I help you today?',
  },
  showCart: {
    he: () => 'בבקשה הנה עגלת הקניות שלך',
    en: () => 'Here is your cart:',
  },
  clearCart: {
    he: () => 'האם אתה בטוח שברצונך לרוקן את העגלה שלך?',
    en: () => 'Are you shore you want to clear your cart?',
  },
  isProductAvailable: {
    en: (action: any) =>
      `The product ${action?.list[0]?.name} is ${
        action?.list[0]?.isAvailable ? 'available' : 'not available'
      }`,
    he: (action: any) =>
      `המוצר ${action?.list[0]?.name} ${
        action?.list[0]?.isAvailable ? 'זמין' : 'לא זמין'
      }`,
  },
};

enum ResponseDictionary {
  introductionMessage = 'introductionMessage',
  addingItemsToCart = 'addingItemsToCart',
  removingItemsFromCart = 'removingItemsFromCart',
  addingX = 'addingX',
  addingBeMoreSpecific = 'addingBeMoreSpecific',
  removingX = 'removingX',
  removingBeMoreSpecific = 'removingBeMoreSpecific',
  sayingHallo = 'sayingHallo',
  showCart = 'showCart',
  clearCart = 'clearCart',
  isProductAvailable = 'isProductAvailable',
}

export enum Language {
  HE = 'he',
  EN = 'en',
}
