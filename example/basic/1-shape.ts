import { runExample } from '../example-runner';

// 1-1 Rename field
runExample(
  { contact_name: "Jack" }, // src data
  [                         // mapping rule
    {
      name: '__root__',
      rules: [
        [ '$.contact_name', 'T.name' ]
      ]
    }
  ]
);

// 1-2 Extract field to higher level
runExample(
  { contact: { email: 'a@b.com'} },
  [
    {
      name: '__root__',
      rules: [
        ['$.contact.email', 'T.emailAddress']
      ]
    }
  ]
);

// 1-3 Wrap field to deeper level
runExample(
  { email: 'a@b.com' },
  [
    {
      name: '__root__',
      rules: [
        ['$.email', 'T.contact.name']
      ]
    }
  ]
);

// 1-4 wrap root value to obj
runExample(
  "a@b.com",
  [
    {
      name: '__root__',
      rules: [
        ['$', 'T.email']
      ]
    }
  ]
);

// 1-5 downgrade obj to atomic value
runExample(
  { name: "Jack" },
  [
    {
      name: '__root__',
      rules: [
        ['$.name', 'T']
      ]
    }
  ]
);