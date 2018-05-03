import { runExample } from '../example-runner';


// 2-1 Array indexing
runExample(
  { book_id_list: [ 1, 2, 3, 4 ] },
  [
    {
      name: '__root__',
      rules: [
        ['$.book_id_list[0]', 'T.firstId']
      ]
    }
  ]
);

// 2-2 Copy array
runExample(
  { book_id_list: [ 1, 2, 3, 4 ] },
  [
    {
      name: '__root__',
      rules: [
        ['$.book_id_list', 'T.bookIdList']
      ]
    }
  ]
);

// 2-3 Iterate array
runExample(
  { book_id_list: [ 1, 2, 3, 4 ] },
  [
    {
      name: '__root__',
      rules: [
        ['$.book_id_list', '~string.itoa', 'T.bookIdList']
      ]
    }
  ]
);

// 2-4 Truncate array
runExample(
  { book_id_list: [ 1, 2, 3, 4 ] },
  [
    {
      name: '__root__',
      rules: [
        ['$.book_id_list[0:3]', 'T.top3id']
      ]
    }
  ]
);

// 2-5 wrap array
runExample(
  { book_id: 1 },
  [
    {
      name: '__root__',
      rules: [
        ['$.book_id', 'array.wrap', 'T.bookIdList']
      ]
    }
  ]
);