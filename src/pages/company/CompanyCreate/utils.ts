export function extractCompanyInfo(email:any) {
  // Validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Invalid email format" };
  }

  // Split the email to extract the domain
  const domain = email.split('@')[1];

  // Check if it's a generic email provider
  const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  if (genericDomains.includes(domain)) {
    return {
      companyName: "",
      companyURL: `https://`
    };
  }

  // Infer company name from the domain
  const companyName = domain.split('.')[0]; // Use the first part of the domain as the company name

  // Construct the company URL
  const companyURL = `https://${domain}`;

  return {
    companyName: companyName.charAt(0).toUpperCase() + companyName.slice(1),
    companyURL: companyURL || ""
  };
}
