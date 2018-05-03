import { convert } from "../../lib/converter";

// 3-3: iterate level-2 array
let result = convert(
  {
    contact_list: [
      {
        name: "Jack",
        emails: [
          "a@1.com",
          "b@1.com"
        ]
      }
    ]
  },
  [
    {
      name: "__root__",
      rules: [
        ['$.contact_list', '~reshapeContact', 'array.merge', 'T.contactsPerEmail'],
      ]
    },
  ],
  {
    'reshapeContact': {
      in: 1,
      out: 1,
      exec: (contact) => {
        const contactName = contact.name;
        return contact.emails.map(email => ({
          name: contactName,
          email,
        }));
      },
      err: (e) => null,
    }
  }
);

console.log('Result: ', JSON.stringify(result, null, '\t'));