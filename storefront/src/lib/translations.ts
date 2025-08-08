// Lithuanian translations for the storefront
export const lt = {
  // General
  loading: "Kraunama...",
  error: "Klaida",
  success: "Sėkmingai",
  cancel: "Atšaukti",
  continue: "Tęsti",
  back: "Atgal",
  next: "Toliau",
  save: "Išsaugoti",
  edit: "Redaguoti",
  delete: "Ištrinti",
  search: "Ieškoti",
  filter: "Filtruoti",
  select: "Pasirinkti",
  selected: "Pasirinkta",
  required: "Privalomas laukas",
  optional: "Neprivalomas",
  continueToPayment: "Tęsti prie mokėjimo",

  // Cart & Checkout
  cart: {
    title: "Prekių krepšelis",
    empty: "Jūsų krepšelis tuščias",
    emptyMessage: "Pridėkite prekių kad pradėtumėte",
    total: "Viso",
    subtotal: "Tarpinė suma",
    shipping: "Pristatymas",
    tax: "PVM",
    addToCart: "Į krepšelį",
    removeFromCart: "Pašalinti iš krepšelio",
    updateQuantity: "Keisti kiekį",
    proceedToCheckout: "Pereiti prie apmokėjimo",
    backToShopping: "Grįžti į parduotuvę",
    calculatedAtCheckout: "Apskaičiuojama apmokėjimo metu",
    calculatedAtPayment: "Apskaičiuojamas mokant",
    quantity: "Kiekis"
  },

  checkout: {
    title: "Užsakymo apmokėjimas",
    steps: {
      shipping: "Pristatymo adresas",
      shippingMethod: "Pristatymo būdas", 
      payment: "Mokėjimas",
      review: "Užsakymo peržiūra"
    },
    
    // Address Form
    address: {
      title: "Pristatymo adresas",
      firstName: "Vardas",
      lastName: "Pavardė",
      company: "Įmonė (neprivaloma)",
      address1: "Adresas",
      address2: "Papildomas adresas (neprivaloma)",
      city: "Miestas",
      postalCode: "Pašto kodas",
      country: "Šalis",
      phone: "Telefono numeris",
      email: "El. pašto adresas",
      
      // Validation messages
      firstNameRequired: "Vardas yra privalomas",
      lastNameRequired: "Pavardė yra privaloma",
      addressRequired: "Adresas yra privalomas",
      cityRequired: "Miestas yra privalomas",
      postalCodeRequired: "Pašto kodas yra privalomas",
      phoneRequired: "Telefono numeris yra privalomas",
      emailRequired: "El. pašto adresas yra privalomas",
      emailInvalid: "Neteisingas el. pašto adreso formatas"
    },

    // Shipping Methods
    shipping: {
      title: "Pristatymo būdas",
      selectMethod: "Pasirinkite pristatymo būdą",
      noMethods: "Nėra prieinamų pristatymo būdų",
      standard: "Standartinis pristatymas",
      express: "Skubus pristatymas",
      pickup: "Atsiėmimas paštomate/punkte",
      locker: "Atsiėmimas paštomate",
      postOffice: "Atsiėmimas pašte",
      
      // Delivery descriptions
      courierDelivery: "Pristatymas kurjeriu iki durų",
      expressDelivery: "Skubus pristatymas kurjeriu",
      pickupPointDelivery: "Atsiėmimas pasirinktame punkte",
      lockerDelivery: "Atsiėmimas automatiniame paštomate",
      postOfficeDelivery: "Atsiėmimas pašto skyriuje",
      standardShipping: "Standartinis pristatymas",
      
      // Venipak specific
      venipakCourier: "Venipak kurjerė",
      venipakExpress: "Venipak skubus pristatymas", 
      venipakPickupPoint: "Venipak atsiėmimo punktas",
      venipakLocker: "Venipak paštomat",
      venipakPostOffice: "POST pašto skyrius",
      
      // Timing
      businessDays: "darbo dienų",
      nextDay: "kitos dienos",
      sameDay: "tos pačios dienos",
      delivery: "Pristatymas",
      
      // Pickup point selection
      pickupLocation: "Atsiėmimo vieta",
      pickupLocationRequired: "Būtina pasirinkti atsiėmimo vietą",
      selectLocation: "Pasirinkti vietą",
      changeLocation: "Keisti vietą",
      pickupRequired: "Prašome pasirinkti atsiėmimo vietą",
      noLocationSelected: "Nepasirinkta atsiėmimo vieta",
      pleaseSelectPickupLocation: "Prašome pasirinkti atsiėmimo vietą, kad tęstumėte",
      
      // Buttons and actions
      retry: "Bandyti dar kartą",
      setting: "Nustatoma...",
      continueToPayment: "Tęsti prie mokėjimo",
      cancel: "Atšaukti",
      
      // Dialog
      selectPickupLocationDialog: "Pasirinkti atsiėmimo vietą",
      chooseConvenientLocation: "Pasirinkite patogų atsiėmimo punktą savo užsakymui"
    },

    // Payment
    payment: {
      title: "Mokėjimo būdas",
      selectMethod: "Pasirinkite mokėjimo būdą",
      cardPayment: "Mokėjimas banko kortele",
      bankTransfer: "Banko pavedimas",
      payOnDelivery: "Mokėjimas gavus prekę",
      
      // Payment providers
      payseraPayment: "Paysera mokėjimas",
      payseraDescription: "Mokėjimas per Paysera - banko pavedimai, kortelės ir elektroniniai piniginės",
      creditCardPayment: "Kredito/debeto kortelė (Stripe)",
      creditCardDescription: "Saugus mokėjimas Visa, Mastercard arba American Express kortelėmis",
      manualPayment: "Rankinis mokėjimas",
      manualPaymentDescription: "Rankinis mokėjimo apdorojimas",
      manualPaymentFull: "Rankinis mokėjimo apdorojimas - užsakymas bus apdorotas rankiniu būdu",
      securePayment: "Saugus mokėjimo apdorojimas",
      
      // States and messages
      loadingPaymentOptions: "Kraunamos mokėjimo galimybės...",
      noPaymentProviders: "Mokėjimo paslaugų teikėjai neprieinami",
      pleaseSelectPayment: "Prašome pasirinkti mokėjimo būdą",
      settingUp: "Nustatoma...",
      reviewOrder: "Peržiūrėti užsakymą",
      
      // Card details
      cardNumber: "Kortelės numeris",
      expiryDate: "Galiojimo data",
      cvv: "CVV kodas",
      cardHolder: "Kortelės savininkas",
      
      // Validation
      cardRequired: "Kortelės numeris yra privalomas",
      expiryRequired: "Galiojimo data yra privaloma", 
      cvvRequired: "CVV kodas yra privalomas",
      cardHolderRequired: "Kortelės savininkas yra privalomas"
    },

    // Order Review
    review: {
      title: "Užsakymo peržiūra",
      reviewYourOrder: "Peržiūrėkite savo užsakymą",
      orderSummary: "Užsakymo santrauka",
      items: "Prekės",
      orderItems: "Užsakymo prekės",
      shippingAddress: "Pristatymo adresas",
      shippingMethod: "Pristatymo būdas",
      paymentMethod: "Mokėjimo būdas",
      total: "Galutinė suma",
      placeOrder: "Pateikti užsakymą",
      processingOrder: "Apdorojamas užsakymas...",
      processing: "Apdorojama...",
      taxIncluded: "Įskaičiuotas",
      
      // Terms and conditions
      termsAccept: "Sutinku su",
      termsLink: "pardavimo sąlygomis",
      privacyLink: "privatumo politika",
      termsRequired: "Privalote sutikti su pardavimo sąlygomis"
    },

    // Order confirmation
    confirmation: {
      title: "Užsakymas pateiktas!",
      thankYou: "Ačiū už jūsų užsakymą!",
      orderNumber: "Užsakymo numeris",
      confirmationEmail: "Užsakymo patvirtinimas išsiųstas el. paštu",
      trackOrder: "Sekti užsakymą",
      continueShipping: "Tęsti apsipirkimą"
    },

    // Errors
    errors: {
      general: "Įvyko klaida. Prašome bandyti dar kartą.",
      network: "Ryšio klaida. Patikrinkite interneto ryšį.",
      validation: "Prašome patikrinti įvestus duomenis",
      paymentFailed: "Mokėjimas nepavyko. Prašome bandyti dar kartą.",
      orderFailed: "Užsakymo pateikimas nepavyko",
      addressValidation: "Neteisingas adresas",
      shippingNotAvailable: "Pristatymas neprieinamas šiam adresui",
      retry: "Bandyti dar kartą"
    }
  },

  // Pickup Points
  pickupPoints: {
    title: "Pasirinkite atsiėmimo vietą",
    description: "Pasirinkite patogų atsiėmimo punktą savo užsakymui",
    searchCity: "Miestas",
    filterType: "Tipas",
    allTypes: "Visi tipai",
    pickupPoint: "Atsiėmimo punktai",
    locker: "Paštomat",
    postOffice: "Paštas",
    
    // Location details
    address: "Adresas",
    workingHours: "Darbo laikas",
    services: "Paslaugos",
    maxWeight: "Maks. svoris",
    maxDimensions: "Maks. matmenys",
    available247: "24/7 prieinamas",
    closed: "uždaryta",
    
    // Days of week
    monday: "Pirmadienis",
    tuesday: "Antradienis", 
    wednesday: "Trečiadienis",
    thursday: "Ketvirtadienis",
    friday: "Penktadienis",
    saturday: "Šeštadienis",
    sunday: "Sekmadienis",
    
    // Short days
    mon: "Pr",
    tue: "An", 
    wed: "Tr",
    thu: "Kt",
    fri: "Pn",
    sat: "Št",
    sun: "Sk",
    
    // Messages
    noResults: "Nerasta atsiėmimo punktų pagal nurodytus kriterijus",
    loadingPoints: "Kraunami atsiėmimo punktai...",
    selectPoint: "Pasirinkti šį punktą",
    pointSelected: "Punktas pasirinktas",
    
    // Types
    types: {
      pickup_point: "Atsiėmimo punktas",
      locker: "Paštomat", 
      post_office: "Paštas"
    }
  },

  // Product related
  product: {
    product: "Prekė",
    price: "Kaina",
    quantity: "Kiekis",
    inStock: "Yra sandėlyje",
    outOfStock: "Nėra sandėlyje",
    addToCart: "Į krepšelį",
    specifications: "Specifikacijos",
    description: "Aprašymas",
    reviews: "Atsiliepimai"
  },

  // Common form elements
  form: {
    pleaseSelect: "Prašome pasirinkti",
    selectOption: "Pasirinkite variantą",
    enterText: "Įveskite tekstą",
    chooseFile: "Pasirinkti failą",
    submit: "Pateikti",
    reset: "Atstatyti"
  }
};

export type TranslationKeys = typeof lt;
export const translations = { lt };
export default translations;