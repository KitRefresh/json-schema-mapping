import { runExample } from '../example-runner';
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
        let result = [];

        for (let email of contact.emails) {
          result.push({
            name: contact.name,
            email: email,
          });
        }

        return result;
      },
      err: (e) => null,
    }
  }
);

console.log('Result: ', JSON.stringify(result, null, '\t'));

// 3-3: another approach by using iterative pusher
runExample(
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
      name: '__root__',
      rules: [
        ['$.contact_list[0].emails', '~@wrap-email', 'T.contactsPerEmail'],
        ['$.contact_list[0].name', 'T.contactsPerEmail~name']
      ]
    },
    {
      name: 'wrap-email',
      rules: [
        ['$', 'T.email']
      ]
    },
  ]
)