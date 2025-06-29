export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your username",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "bags", label: "Bags" },
      { id: "footwear", label: "Footwear" },
      { id: "preorder", label: "PreOrder" },
    ],
  },
  {
    label: "Sizes",
    name: "sizes",
    componentType: "checkboxes",
    options: [
      { id: "36", label: "S" },
      { id: "38", label: "M" },
      { id: "40", label: "L" },
      { id: "42", label: "XL" },
      { id: "44", label: "XXL" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Sale Price is 20% discount of actual price",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Shop",
    path: "/shop/listing",
  },
  {
    id: "about",
    label: "About Us",
    path: "/shop/about",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/shop/contact",
  },
  { id: "search",
    label: "Search",
    path: "/shop/search", 
  },
  {
    id:"privacy-policy",
    label:"Privacy Policy",
    path:"/privacy-policy"
  },
  {
    id:"terms",
    label:"Terms of Service",
    path:"/terms"
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  bags: "Bags",
  footwear: "Footwear",
  preorder: "PreOrder",
};

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "bags", label: "Bags" },
    { id: "footwear", label: "Footwear" },
    { id: "preorder", label: "PreOrder" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title A to Z" },
  { id: "title-ztoa", label: "Title Z to A" },
];

export const addressFormControls = [
  {
    label: "Name",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter your full name",
  },
  {
    label: "Country",
    name: "country",
    componentType: "input",
    type: "text",
    placeholder: "Enter your country",
  },
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter delivery address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your mobile number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    type: "text",
    placeholder: "Add additional notes or fill N/A",
  },
];
