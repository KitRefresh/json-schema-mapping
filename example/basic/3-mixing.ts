import { runExample } from '../example-runner';

// 3-1: 2-1 + 1-1
runExample(
  { contact_list: [ { contact_name: 'Jack' } ] },
  [
    {
      name: '__root__',
      rules: [
        ['$.contact_list[0].contact_name', 'T.contactName']
      ]
    }
  ]
);

// 3-2: Treat array as value
runExample(
  { email_list: ['a@ms.com', 'b@ms.com'] },
  [
    {
      name: '__root__',
      rules: [
        ['$.email_list', 'T.emailList']
      ]
    }
  ]
);

// 3-2: Iterate array
runExample(
  { email_list: ['a@ms.com', 'b@ms.com'] },
  [
    {
      name: '__root__',
      rules: [
        ['$.email_list', '~@copy', 'T.emailList']
      ]
    },
    {
      name: 'copy',
      rules: [
        ['$', 'T']
      ]
    }
  ]
);

// 3-3: iterate level-1 array
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
      name: "__root__",
      rules: [
        ['$.contact_list', "~object.get('name')", 'T.contactNameList']
      ]
    },
    {
      name: "An equivalent of ~object.get('name')",
      rules: [
        ['$.name', 'T']
      ]
    }
  ]
);

// 3-3: iterate level-2 array
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
      name: "__root__",
      rules: [
        ['$.contact_list[0].emails', '~@create_email', 'T.contactsPerEmail'],
      ]
    },
    {
      name: "create_email",
      rules: [
        ['$', 'T.email']
      ]
    }
  ]
);