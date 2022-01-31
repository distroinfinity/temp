const dev = {
    // STRIPE_KEY: "pk_test_DpTdKJMsaMHZbzr4wjZJdX0800WmLFCO8U",
    // s3: {
    //   REGION: "us-east-2",
    //   BUCKET: "bestguru-dev-attachmentsbucket-15x8klvbj84yy",
    // },
  
    apiGateway: {
      REGION: "us-east-2",
      URL: "https://dev-landing-endpoint/dev",
    },
    // apiGateway1: {
    //   REGION: "us-east-2",
    //   URL: "https://notify.bestguru.trade/dev",
    // },
    // apiGateway2: {
    //   REGION: "us-east-2",
    //   URL: "https://social.bestguru.trade/dev",
    // },
    cognito: {
      REGION: "us-east-2",
      USER_POOL_ID: "us-east-2_3KyV6eAFt",
      APP_CLIENT_ID: "17bbvdbepv6e51gmlr72hg27sa",
      IDENTITY_POOL_ID: "us-east-2:39723fa4-c9e1-4034-86a6-c815b246313c",
      DOMAIN: "dev-robofy.auth.us-east-2.amazoncognito.com",
    },
    // stream: {
    //   KEY: "ddg35q6m8cuw",
    //   APP_ID: "80124",
    // },
    
    REDIRECT_URL: "http://localhost:3000/",
  };

  // Default to dev if not set
const config =  dev;
