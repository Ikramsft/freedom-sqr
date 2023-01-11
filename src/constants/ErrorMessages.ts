const ErrorMessages = {
  login: {
    wrongCredentials: 'Incorrect Username or Password',
    email: {
      invalid: 'Please enter a valid email address',
      required: 'Please enter email address',
    },
    password: 'Please enter password',
  },
  signup: {
    userName:
      'Username must be between 4-75 characters, contain 1 letter, and may contain no special characters except underscore.',
    userNameExists: 'Username is taken - please try another',
    email: 'Please enter a valid email address.',
    emailExists: 'Account already exists - Please Login',
    password:
      'Password must be between 8-128 characters, it must contain 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.',
    repeatPassword: 'Password must match.',
    business: 'Please select Yes / No',
    fullName: 'Please Enter Full Name',
  },
  password: {
    valid:
      'Password must be between 8-128 characters, it must contain 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.',
    match: 'Password must match.',
  },
  businessInfo: {
    name: {
      required: 'Please enter current business name',
      valid:
        'Business name must be between 4-75 characters, contain 1 letter, and may contain no special characters except hyphen (-) or apostrophe.',
    },
    contactPersonName: {
      required: 'Please enter name',
      valid:
        'Name must be between 1-35 characters, contain 1 letter, and may contain no special characters except hyphen (-) or apostrophe.',
    },
    email: {
      valid: 'Please enter a valid email address',
      required: 'Please enter email address',
    },
    category: {
      required: 'Please select a Category.',
    },
    address: {
      required: 'Please enter address',
      valid: 'Address must be 5-32 characters.',
    },
    state: {
      required: 'Please select a State.',
    },
    city: {
      required: 'Please enter a City.',
      valid: 'City must be 2-36 characters.',
    },
    zipcode: {
      required: 'Please enter a zip code.',
      valid: 'Please enter a valid Zip code.',
    },
    website: {
      required: 'Please enter website url',
      valid: 'Please enter a valid website URL.',
    },
    phone: {
      required: 'Please enter a valid phone number.',
      valid: 'Please enter a valid phone number.',
    },
    tagline: {
      required: 'Please enter tagline',
      min: 'Tagline must be between 20-100 characters. Please revise and try again.',
      valid:
        'You exceed the maximum limit of 100 characters.Please revise and try again.',
    },
    description: {
      required: 'Please enter description',
      min: 'Description must be between 100-1000 characters. Please revise and try again.',
      valid:
        'You exceed the maximum limit of 1000 characters.Please revise and try again.',
    },
    facebook: {
      valid: 'Please enter valid facebook username',
    },
    instagram: {
      valid: 'Please enter valid instagram username',
    },
    linkedin: {
      valid: 'Please enter valid linkedin username',
    },
    twitter: {
      valid: 'Please enter valid twitter username',
    },
  },
  cardInfo: {
    aliasName: {
      required: 'Please enter alias',
      valid:
        'Name must be between 1-35 characters, contain 1 letter, and may contain no special characters except hyphen (-) or apostrophe.',
    },
    billingName: {
      required: 'Please enter billing name',
      valid:
        'Name must be between 1-30 characters, contain 1 letter, and may contain no special characters except hyphen (-) or apostrophe.',
    },
    numbers: 'Please enter a valid card number.',
    expireMonth: {
      required: 'Please select a month.',
      valid: 'Please select valid expiration month',
    },
    expireYear: {
      required: 'Please select a year.',
      valid: 'Please select valid expiration year',
    },
    address: {
      required: 'Please enter Address.',
      valid: 'Address must be 5-32 characters.',
    },
    city: {
      required: 'Please enter a City.',
      valid: 'City must be 2-36 characters.',
    },
    state: 'Please enter a State.',
    zip: 'Please enter a valid Zip code.',
  },
  achInfo: {
    name: {
      required: 'Please enter name',
      valid:
        'Name must be between 1-35 characters, contain 1 letter, and may contain no special characters except hyphen (-) or apostrophe.',
    },
    accountNumber: {
      valid: 'Invalid Account Number.',
    },
    routingNumber: {
      valid: 'Invalid Routing Number.',
    },
  },
};

export default ErrorMessages;
