/**
 * Digital Guardians - Learning Center JavaScript
 * 
 * Tutorial management and navigation
 */

// ============================================================================
// TUTORIAL CONTENT DATA
// ============================================================================

const TutorialContent = {
    email: {
        title: 'Email Basics',
        tutorials: [
            {
                id: 'email-basics-1',
                title: 'How to Read and Understand Email',
                steps: 5,
                content: [
                    {
                        title: 'Finding Your Inbox',
                        description: 'Your inbox is where new messages arrive. Think of it like your regular mailbox — this is where you receive your mail.',
                        screenshot: {
                            alt: 'Email inbox showing list of messages',
                            placeholder: 'Inbox screenshot placeholder'
                        },
                        action: 'Your inbox shows a list of all your emails. New, unread messages appear in bold text.',
                        keyPoint: 'Messages in bold are new and haven\'t been read yet.'
                    },
                    {
                        title: 'Opening a Message',
                        description: 'To read a message, click on its title (also called the "subject line") once with your mouse, or tap on it once if using a touchscreen.',
                        screenshot: {
                            alt: 'Clicking on an email to open it',
                            placeholder: 'Opening email screenshot'
                        },
                        action: 'Click the subject line once. You don\'t need to double-click!',
                        keyPoint: 'A single click or tap is usually enough to open a message.'
                    },
                    {
                        title: 'Understanding the Email Layout',
                        description: 'When you open an email, you\'ll see who sent it, when they sent it, and what they wrote. The "From" line tells you who sent it.',
                        screenshot: {
                            alt: 'Email message layout showing sender, date, and content',
                            placeholder: 'Email layout screenshot'
                        },
                        action: 'Always check who the email is from before reading the message.',
                        keyPoint: 'If you don\'t know the sender, be careful about what you do next.'
                    },
                    {
                        title: 'Replying to an Email',
                        description: 'To respond to an email, click the "Reply" button. A box will appear where you can type your response.',
                        screenshot: {
                            alt: 'Reply button highlighted in the email toolbar',
                            placeholder: 'Reply button screenshot'
                        },
                        action: 'Click "Reply" only if you know the person and expect their email.',
                        keyPoint: 'It\'s okay to ignore emails from people you don\'t know.'
                    },
                    {
                        title: 'Deleting Unwanted Emails',
                        description: 'To delete (remove) an email, look for a trash can icon or a "Delete" button. The email goes to your trash folder.',
                        screenshot: {
                            alt: 'Delete button or trash can icon highlighted',
                            placeholder: 'Delete button screenshot'
                        },
                        action: 'Click the trash can icon to delete unwanted emails.',
                        keyPoint: 'Deleting spam keeps your inbox clean and safe.'
                    }
                ]
            },
            {
                id: 'email-basics-2',
                title: 'Setting Up an Email Account',
                steps: 6,
                content: [
                    {
                        title: 'Choosing an Email Provider',
                        description: 'An email provider is a service that gives you an email address. Popular, free options include Gmail (Google), Outlook (Microsoft), and Yahoo Mail.',
                        screenshot: {
                            alt: 'Screenshot of Gmail, Outlook, and Yahoo websites',
                            placeholder: 'Email providers'
                        },
                        action: 'Choose a well-known provider like Gmail or Outlook. They are free and reliable.',
                        keyPoint: 'Well-known providers have better security and customer support.'
                    },
                    {
                        title: 'Starting the Sign-Up Process',
                        description: 'Go to your chosen provider\'s website and look for a "Create account" or "Sign up" button. Click it to begin.',
                        screenshot: {
                            alt: 'Create account button highlighted on Gmail',
                            placeholder: 'Create account button'
                        },
                        action: 'Look for the "Create account" button — it\'s usually in the top right corner.',
                        keyPoint: 'Take your time. The sign-up process can wait until you\'re ready.'
                    },
                    {
                        title: 'Creating Your Email Address',
                        description: 'Your email address has two parts: your name (or chosen username) and the provider domain. For example: yourname@gmail.com.',
                        screenshot: {
                            alt: 'Form fields for choosing email address',
                            placeholder: 'Email address form'
                        },
                        action: 'Choose something simple that uses your name or a familiar nickname.',
                        keyPoint: 'Pick an address you\'ll remember. Write it down somewhere safe!'
                    },
                    {
                        title: 'Creating a Strong Password',
                        description: 'Your password should be something only you know. It needs to be at least 8 characters long and include letters and numbers.',
                        screenshot: {
                            alt: 'Password field showing example',
                            placeholder: 'Password field'
                        },
                        action: 'Example of a good password: "CatBlue2024" — it\'s easy to remember but hard to guess.',
                        keyPoint: 'Never share your password with anyone, not even family members.'
                    },
                    {
                        title: 'Adding Your Phone Number',
                        description: 'The provider may ask for your phone number. This helps verify your identity and recover your account if you forget your password.',
                        screenshot: {
                            alt: 'Phone number input field',
                            placeholder: 'Phone number field'
                        },
                        action: 'Enter your real phone number so you can receive verification codes.',
                        keyPoint: 'Your phone number is private — only share it with trusted services.'
                    },
                    {
                        title: 'Completing Setup',
                        description: 'Read through the privacy terms (you don\'t need to understand everything) and click "Agree" or "Create Account". Congratulations — you now have email!',
                        screenshot: {
                            alt: 'Agree and create account button',
                            placeholder: 'Final step button'
                        },
                        action: 'Click "Create account" when you\'re ready.',
                        keyPoint: 'You did it! Getting started with email is a big step toward staying connected.'
                    }
                ]
            }
        ]
    },
    passwords: {
        title: 'Passwords',
        tutorials: [
            {
                id: 'passwords-1',
                title: 'Creating a Strong Password',
                steps: 5,
                content: [
                    {
                        title: 'Why Passwords Matter',
                        description: 'A password is like a key to your house — it keeps strangers out of your accounts. A strong password protects your information.',
                        screenshot: {
                            alt: 'Lock icon representing password security',
                            placeholder: 'Password security illustration'
                        },
                        action: 'Your passwords protect your email, banking, and personal information.',
                        keyPoint: 'Strong passwords are your first line of defense online.'
                    },
                    {
                        title: 'What Makes a Strong Password',
                        description: 'A strong password is at least 8 characters long and includes both letters and numbers. It should be something you can remember but others can\'t guess.',
                        screenshot: {
                            alt: 'Examples of weak vs strong passwords',
                            placeholder: 'Password comparison'
                        },
                        action: 'Good example: "CoffeeMorning2024" — personal to you, long, and mix of letters and numbers.',
                        keyPoint: 'Avoid birthdays, names of family pets, or simple patterns like "123456".'
                    },
                    {
                        title: 'Creating Your Password',
                        description: 'Think of a phrase or sentence that\'s meaningful to you. Use the first letter of each word, then add numbers and capitalize some letters.',
                        screenshot: {
                            alt: 'Step-by-step password creation example',
                            placeholder: 'Password creation process'
                        },
                        action: 'Example: "I love spending time with my grandchildren!" → "ILstwmg2024!"',
                        keyPoint: 'Make it personal to you — something only you would think of.'
                    },
                    {
                        title: 'Keeping Track of Passwords',
                        description: 'It\'s okay to write your passwords down — just keep them in a safe place at home, like a locked drawer or a notebook you keep with you.',
                        screenshot: {
                            alt: 'Notebook with written passwords',
                            placeholder: 'Password notebook'
                        },
                        action: 'Write your passwords in a notebook and keep it in a safe place.',
                        keyPoint: 'Never keep passwords on a sticky note on your computer!'
                    },
                    {
                        title: 'When to Change Your Password',
                        description: 'Change your password if you notice anything strange with your accounts, or once a year as a regular habit.',
                        screenshot: {
                            alt: 'Password change reminder calendar',
                            placeholder: 'Password change reminder'
                        },
                        action: 'If you\'re worried about forgetting, set a reminder on your phone.',
                        keyPoint: 'Changing passwords regularly keeps your accounts safer.'
                    }
                ]
            },
            {
                id: 'passwords-2',
                title: 'Resetting or Recovering a Password',
                steps: 6,
                content: [
                    {
                        title: 'What Happens When You Forget',
                        description: 'It happens to everyone! Most websites have a way to reset your password if you\'ve forgotten it.',
                        screenshot: {
                            alt: 'Forgot password link on login page',
                            placeholder: 'Forgot password link'
                        },
                        action: 'Click "Forgot password?" when you can\'t remember yours.',
                        keyPoint: 'Forgetting a password is normal — there\'s always a way to fix it.'
                    },
                    {
                        title: 'Starting Password Recovery',
                        description: 'Click "Forgot password?" and enter your email address. The website will send you instructions to reset your password.',
                        screenshot: {
                            alt: 'Email input for password recovery',
                            placeholder: 'Recovery email input'
                        },
                        action: 'Enter the email address you used to create the account.',
                        keyPoint: 'Make sure you have access to that email address!'
                    },
                    {
                        title: 'Checking Your Email',
                        description: 'Look for an email from the service with a link to reset your password. It usually arrives within a few minutes.',
                        screenshot: {
                            alt: 'Password reset email example',
                            placeholder: 'Reset email'
                        },
                        action: 'Check your inbox (and spam folder too!). Click the link in the email.',
                        keyPoint: 'The reset link is only good for a limited time — usually 24 hours.'
                    },
                    {
                        title: 'Creating a New Password',
                        description: 'Click the link and create a new password. Use what you learned about making strong passwords!',
                        screenshot: {
                            alt: 'New password creation form',
                            placeholder: 'New password form'
                        },
                        action: 'Create a new, strong password and write it down.',
                        keyPoint: 'Don\'t use the same password as before — make it something new!'
                    },
                    {
                        title: 'Confirming the Change',
                        description: 'After creating your new password, click the button to confirm. You may need to log in again with your new password.',
                        screenshot: {
                            alt: 'Confirm password change button',
                            placeholder: 'Confirm button'
                        },
                        action: 'Click "Save" or "Confirm" to finish resetting your password.',
                        keyPoint: 'Write down your new password right away!'
                    },
                    {
                        title: 'Recovery Phone Numbers',
                        description: 'Consider adding a phone number to your account for next time. This makes recovery faster and easier.',
                        screenshot: {
                            alt: 'Account security settings page',
                            placeholder: 'Security settings'
                        },
                        action: 'If prompted, add your phone number for future account recovery.',
                        keyPoint: 'Your phone number helps you get back into your account if you forget again.'
                    }
                ]
            },
            {
                id: 'passwords-3',
                title: 'Managing Multiple Passwords',
                steps: 5,
                content: [
                    {
                        title: 'Why Each Account Needs Its Own Password',
                        description: 'Using the same password everywhere is risky. If one account is compromised, all your accounts could be at risk.',
                        illustration: 'Multiple locks representing separate passwords',
                        action: 'Each important account should have its own unique password.',
                        keyPoint: 'Think of it like having different keys for your house, car, and safe.'
                    },
                    {
                        title: 'Creating a Password System',
                        description: 'Create a simple system to remember different passwords. For example: add the service name to your base password.',
                        illustration: 'Password system example',
                        action: 'Example: Base password "Coffee2024!" plus service name = "Coffee2024!Gmail"',
                        keyPoint: 'Write them down with hints, not the full passwords.'
                    },
                    {
                        title: 'Password Notebook',
                        description: 'Keep a dedicated notebook with all your passwords. Store it in a safe place, like a drawer or locked cabinet.',
                        illustration: 'Secure password notebook',
                        action: 'Label your notebook "Passwords" and keep it private.',
                        keyPoint: 'A physical notebook is safer than saving passwords in your computer.'
                    },
                    {
                        title: 'Using Password Hints',
                        description: 'Instead of writing full passwords, write hints that only you understand.',
                        illustration: 'Password hint examples',
                        action: 'Example hint: "My first pet\'s name + 2024!"',
                        keyPoint: 'A good hint helps you remember without giving away the password.'
                    },
                    {
                        title: 'When to Ask for Help',
                        description: 'If you\'re having trouble managing passwords, ask a trusted family member or friend to help you set up a safe system.',
                        illustration: 'Person helping with passwords',
                        action: 'It\'s okay to ask for help with technology!',
                        keyPoint: 'Never share your actual passwords — just ask for help learning the system.'
                    }
                ]
            }
        ]
    },
    scams: {
        title: 'Spotting Scams',
        tutorials: [
            {
                id: 'scams-1',
                title: 'Recognizing Scam Emails',
                steps: 6,
                content: [
                    {
                        title: 'What is a Scam Email?',
                        description: 'A scam email is a fake message designed to trick you into giving away personal information or money. These are also called "phishing" emails.',
                        screenshot: {
                            alt: 'Example of a scam email with warning labels',
                            placeholder: 'Scam email example'
                        },
                        action: 'Scam emails try to look real, but there are always clues.',
                        keyPoint: 'If something feels wrong, it probably is.'
                    },
                    {
                        title: 'Check the Sender',
                        description: 'Look closely at who sent the email. Scammers use fake email addresses that look real at first glance.',
                        screenshot: {
                            alt: 'Email sender address with arrows pointing to suspicious parts',
                            placeholder: 'Suspicious sender example'
                        },
                        action: 'Hover over the sender name to see the real email address.',
                        keyPoint: 'Real companies use their own domain names (like @bankname.com), not free email services.'
                    },
                    {
                        title: 'Watch for Urgency',
                        description: 'Scammers try to make you act fast without thinking. Watch for words like "Urgent", "Immediately", "Act Now", or "Limited Time".',
                        screenshot: {
                            alt: 'Urgency words highlighted in red',
                            placeholder: 'Urgency warning example'
                        },
                        action: 'Take your time. Real businesses don\'t pressure you to act instantly.',
                        keyPoint: 'Urgency is a red flag — scammers want you to panic.'
                    },
                    {
                        title: 'Suspicious Links',
                        description: 'Scam emails often contain links that lead to fake websites. These links may look real but take you somewhere dangerous.',
                        screenshot: {
                            alt: 'Link URL showing it doesn\'t match the company website',
                            placeholder: 'Suspicious link example'
                        },
                        action: 'Never click links in unexpected emails. Go to websites directly by typing the address yourself.',
                        keyPoint: 'When in doubt, don\'t click!'
                    },
                    {
                        title: 'Requests for Money or Information',
                        description: 'Be very careful if an email asks for money, gift cards, wire transfers, or personal information like Social Security numbers.',
                        screenshot: {
                            alt: 'Warning about requests for money',
                            placeholder: 'Money request warning'
                        },
                        action: 'Real organizations won\'t ask for payment through gift cards or wire transfers.',
                        keyPoint: 'Gift cards and wire transfers are almost always scams.'
                    },
                    {
                        title: 'What to Do With Suspicious Emails',
                        description: 'If you think an email might be a scam, don\'t click anything! Delete it. If it\'s supposedly from a real company, call them directly using a number from your statement.',
                        screenshot: {
                            alt: 'Steps for handling suspicious email',
                            placeholder: 'What to do flowchart'
                        },
                        action: 'When in doubt: don\'t click, don\'t reply, don\'t call numbers in the email. Delete and delete!',
                        keyPoint: 'You\'re doing the right thing by being careful!'
                    }
                ]
            },
            {
                id: 'scams-2',
                title: 'Understanding Why Scams Work',
                steps: 5,
                content: [
                    {
                        title: 'Scammers Are Professionals',
                        description: 'Scammers study psychology and spend all day creating convincing messages. They\'re very good at what they do.',
                        illustration: 'Professional scammer illustration',
                        action: 'Getting scammed doesn\'t mean you\'re gullible — it means scammers are deceiving.',
                        keyPoint: 'This can happen to anyone. It\'s not your fault.'
                    },
                    {
                        title: 'They Exploit Trust',
                        description: 'Scammers pretend to be companies or people you trust — banks, government agencies, even family members.',
                        illustration: 'Trust being exploited',
                        action: 'Always verify by contacting the organization directly.',
                        keyPoint: 'If something feels off, verify through a separate channel.'
                    },
                    {
                        title: 'They Create Fear',
                        description: 'Many scams try to scare you: threats of arrest, account closure, or legal action. Fear makes people act without thinking.',
                        illustration: 'Fear tactics warning',
                        action: 'Take a breath. Real organizations don\'t threaten you through email.',
                        keyPoint: 'Fear is a tool to make you panic.'
                    },
                    {
                        title: 'They Appeal to Greed',
                        description: 'Other scams promise prizes, lottery winnings, or inheritance from a distant relative. If it sounds too good to be true, it probably is.',
                        illustration: 'Too good to be true warning',
                        action: 'Remember: real prizes don\'t require payment to claim.',
                        keyPoint: 'When it\'s free money, it\'s always a scam.'
                    },
                    {
                        title: 'It\'s Not Your Fault',
                        description: 'Scammers are criminals who spend their lives deceiving people. Being targeted doesn\'t mean you did anything wrong.',
                        illustration: 'Supportive message',
                        action: 'If something happens, tell someone you trust right away.',
                        keyPoint: 'You\'re not alone, and there\'s always help available.'
                    }
                ]
            },
            {
                id: 'scams-3',
                title: 'Recognizing Fake Links',
                steps: 6,
                content: [
                    {
                        title: 'What is a Fake Link?',
                        description: 'A fake link takes you to a malicious website that looks real. These sites steal your login information or install harmful software.',
                        screenshot: {
                            alt: 'Real vs fake website comparison',
                            placeholder: 'Link comparison'
                        },
                        action: 'Scammers make links that look trustworthy but lead to dangerous sites.',
                        keyPoint: 'Think before you click!'
                    },
                    {
                        title: 'Hover to Check Links',
                        description: 'On a computer, hover your mouse over a link (don\'t click!) to see where it really goes. The real address appears in the bottom left of your browser.',
                        screenshot: {
                            alt: 'Hovering over link to reveal true URL',
                            placeholder: 'Hover technique'
                        },
                        action: 'The URL in the popup should match the company\'s real website address.',
                        keyPoint: 'If the address looks strange, don\'t click!'
                    },
                    {
                        title: 'URL Red Flags',
                        description: 'Watch for strange spellings, extra words, or unfamiliar domain names. Example: bankofamerica-secure.com is NOT the real Bank of America.',
                        screenshot: {
                            alt: 'Suspicious URL examples',
                            placeholder: 'Suspicious URLs'
                        },
                        action: 'Real company URLs are simple: amazon.com, bankofamerica.com, paypal.com',
                        keyPoint: 'Scammers add words to real names to trick you.'
                    },
                    {
                        title: 'Mobile Link Checking',
                        description: 'On phones, long-press on a link to preview the URL. On tablets, hover might work if you have a keyboard.',
                        screenshot: {
                            alt: 'Long-press on mobile to preview link',
                            placeholder: 'Mobile link preview'
                        },
                        action: 'Take your time and check the address before tapping.',
                        keyPoint: 'Links on mobile are easy to tap by accident — be careful!'
                    },
                    {
                        title: 'When in Doubt, Go Direct',
                        description: 'If you need to access a website, open your browser and type the address yourself. Never click email links for important sites.',
                        screenshot: {
                            alt: 'Typing website address directly',
                            placeholder: 'Direct website access'
                        },
                        action: 'Bookmark your important sites so you can always find them safely.',
                        keyPoint: 'Going directly is the safest way!'
                    },
                    {
                        title: 'Protecting Yourself',
                        description: 'Keep your web browser updated. Modern browsers warn you about suspicious websites. Listen to those warnings!',
                        screenshot: {
                            alt: 'Browser security warning example',
                            placeholder: 'Browser warning'
                        },
                        action: 'If your browser says a site might be dangerous, leave immediately.',
                        keyPoint: 'Browser warnings are there to protect you.'
                    }
                ]
            },
            {
                id: 'scams-4',
                title: 'Safe Digital Habits',
                steps: 5,
                content: [
                    {
                        title: 'Take Your Time',
                        description: 'Scammers want you to act fast. Before clicking, replying, or providing any information, pause and think.',
                        illustration: 'Pause button concept',
                        action: 'There\'s no rush. Taking time is always the right choice.',
                        keyPoint: 'When in doubt, wait overnight and think about it.'
                    },
                    {
                        title: 'Verify Directly',
                        description: 'If an email claims to be from your bank or a company, don\'t use links in the email. Call them using a number from your card or statement.',
                        illustration: 'Direct phone call',
                        action: 'Use phone numbers from your own documents, not the email.',
                        keyPoint: 'Call them directly to verify.'
                    },
                    {
                        title: 'Keep Personal Information Private',
                        description: 'Your Social Security number, full date of birth, and passwords should never be shared through email, text, or phone calls you didn\'t initiate.',
                        illustration: 'Personal information lock',
                        action: 'Real organizations won\'t ask for this information through these channels.',
                        keyPoint: 'When in doubt, don\'t share.'
                    },
                    {
                        title: 'Report Suspicious Messages',
                        description: 'If you receive a suspicious email, report it. Most email providers have a "Report phishing" button. This helps protect others.',
                        screenshot: {
                            alt: 'Report phishing button location',
                            placeholder: 'Report button'
                        },
                        action: 'Reporting helps stop scammers from hurting other people.',
                        keyPoint: 'You\'re helping by reporting!'
                    },
                    {
                        title: 'Trust Your Instincts',
                        description: 'If something feels wrong, it probably is. It\'s always better to be cautious. You can always ask for help.',
                        illustration: 'Trust your instincts',
                        action: 'Talk to family members or friends when you\'re unsure.',
                        keyPoint: 'There are no stupid questions when it comes to your safety.'
                    }
                ]
            }
        ]
    },
    browsing: {
        title: 'Safe Browsing',
        tutorials: [
            {
                id: 'browsing-1',
                title: 'Recognizing Trustworthy Websites',
                steps: 5,
                content: [
                    {
                        title: 'What Makes a Website Trustworthy?',
                        description: 'Trustworthy websites are honest about who they are, have clear contact information, and don\'t ask for unnecessary personal information.',
                        screenshot: {
                            alt: 'Elements of a trustworthy website',
                            placeholder: 'Trustworthy website example'
                        },
                        action: 'Look for clear company information and contact details.',
                        keyPoint: 'Legitimate businesses want you to know who they are.'
                    },
                    {
                        title: 'Secure Connections',
                        description: 'Trustworthy sites use "https://" at the beginning of their address. The lock icon in your browser means the connection is secure.',
                        screenshot: {
                            alt: 'Lock icon and https:// in address bar',
                            placeholder: 'Secure connection indicator'
                        },
                        action: 'Look for the lock icon when entering personal information.',
                        keyPoint: 'The lock means your information is encrypted.'
                    },
                    {
                        title: 'About Advertising',
                        description: 'Many trustworthy sites have ads, but too many pop-ups, flashing ads, or "you won!" messages can indicate a questionable site.',
                        screenshot: {
                            alt: 'Clean website vs website with suspicious ads',
                            placeholder: 'Website comparison'
                        },
                        action: 'Excessive pop-ups and flashing ads are warning signs.',
                        keyPoint: 'If a site looks messy with ads, be careful.'
                    },
                    {
                        title: 'Contact Information',
                        description: 'Real businesses provide ways to contact them: address, phone number, or contact form. Be wary of sites with no contact information.',
                        screenshot: {
                            alt: 'Contact information section on website',
                            placeholder: 'Contact info example'
                        },
                        action: 'Look for "Contact Us" or "About Us" pages.',
                        keyPoint: 'Real companies make it easy to reach them.'
                    },
                    {
                        title: 'Reading Privacy Policies',
                        description: 'Trustworthy sites have a privacy policy explaining how they use your information. You don\'t need to read it all, but its existence is a good sign.',
                        screenshot: {
                            alt: 'Privacy policy link in footer',
                            placeholder: 'Privacy policy link'
                        },
                        action: 'A link to a privacy policy in the footer is a good sign.',
                        keyPoint: 'Privacy policies show the company follows rules.'
                    }
                ]
            },
            {
                id: 'browsing-2',
                title: 'Browser Safety Basics',
                steps: 6,
                content: [
                    {
                        title: 'Your Browser is Your Window',
                        description: 'A web browser (Chrome, Firefox, Edge, Safari) is the program you use to visit websites. It\'s your window to the internet.',
                        screenshot: {
                            alt: 'Common browser icons',
                            placeholder: 'Browser examples'
                        },
                        action: 'Keep your browser updated for the best security.',
                        keyPoint: 'Updates fix security problems.'
                    },
                    {
                        title: 'Understanding the Address Bar',
                        description: 'The address bar shows the website you\'re visiting. Always check it before entering personal information.',
                        screenshot: {
                            alt: 'Address bar labeled',
                            placeholder: 'Address bar example'
                        },
                        action: 'Type addresses carefully and check them before proceeding.',
                        keyPoint: 'The address bar is your safety check.'
                    },
                    {
                        title: 'Using Bookmarks',
                        description: 'Bookmarks save website addresses so you don\'t have to type them. They also keep you safe from mistyped addresses.',
                        screenshot: {
                            alt: 'Bookmarking a website',
                            placeholder: 'Bookmark process'
                        },
                        action: 'Bookmark sites you use often, especially banking sites.',
                        keyPoint: 'Bookmarks prevent typo-based scams.'
                    },
                    {
                        title: 'Browser Warnings',
                        description: 'If your browser shows a warning like "Your connection is not private," take it seriously. This means there\'s a problem.',
                        screenshot: {
                            alt: 'Browser security warning',
                            placeholder: 'Security warning'
                        },
                        action: 'Don\'t proceed past security warnings unless you\'re absolutely sure it\'s safe.',
                        keyPoint: 'Browser warnings protect you!'
                    },
                    {
                        title: 'Clearing Your History',
                        description: 'You can delete your browsing history anytime. This removes records of websites you\'ve visited.',
                        screenshot: {
                            alt: 'How to clear browsing history',
                            placeholder: 'Clear history menu'
                        },
                        action: 'This is normal and nothing to be embarrassed about.',
                        keyPoint: 'You can always clear your history.'
                    },
                    {
                        title: 'Getting Help with Browsing',
                        description: 'If something confuses you while browsing, it\'s okay to ask for help. Family members, libraries, and community centers often offer tech help.',
                        illustration: 'Getting help with technology',
                        action: 'Never feel embarrassed to ask questions.',
                        keyPoint: 'Everyone needs help sometimes!'
                    }
                ]
            }
        ]
    }
};

// ============================================================================
// TUTORIAL CONTROLLER
// ============================================================================

const TutorialController = {
    currentCategory: null,
    currentTutorial: null,
    currentStep: 0,
    totalSteps: 0,

    /**
     * Initialize tutorial functionality
     */
    init() {
        this.bindCategoryCards();
        this.bindModalControls();
    },

    /**
     * Bind category card clicks
     */
    bindCategoryCards() {
        const cards = document.querySelectorAll('.category-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.showCategory(category);
            });
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const category = card.dataset.category;
                    this.showCategory(category);
                }
            });
        });
    },

    /**
     * Bind modal controls
     */
    bindModalControls() {
        const modal = document.getElementById('tutorialModal');
        const closeBtn = document.getElementById('closeTutorial');
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const playAudioBtn = document.getElementById('playAudio');
        const audioSpeed = document.getElementById('audioSpeed');

        // Close modal
        closeBtn.addEventListener('click', () => this.closeModal());
        
        // Close on backdrop click
        modal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal());
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });

        // Navigation
        prevBtn.addEventListener('click', () => this.prevStep());
        nextBtn.addEventListener('click', () => this.nextStep());

        // Audio
        playAudioBtn.addEventListener('click', () => this.readStep());
        
        audioSpeed.addEventListener('change', (e) => {
            AudioController.setRate(parseFloat(e.target.value));
        });
    },

    /**
     * Show category tutorials
     * @param {string} category - Category ID
     */
    showCategory(category) {
        const content = TutorialContent[category];
        if (!content) return;

        // Create category view
        let tutorialsHtml = `<h2>${content.title}</h2>`;
        tutorialsHtml += '<div class="tutorials-list">';
        
        content.tutorials.forEach(tutorial => {
            tutorialsHtml += `
                <article class="tutorial-item" data-tutorial="${tutorial.id}">
                    <h3>${tutorial.title}</h3>
                    <p>${tutorial.steps} easy steps</p>
                </article>
            `;
        });
        
        tutorialsHtml += '</div>';

        // Replace categories grid with category view
        const categoriesGrid = document.querySelector('.categories-grid');
        categoriesGrid.innerHTML = tutorialsHtml;
        
        // Add back button
        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-secondary mt-lg';
        backBtn.textContent = '← Back to Categories';
        backBtn.addEventListener('click', () => location.reload());
        categoriesGrid.parentElement.insertBefore(backBtn, categoriesGrid.nextSibling);

        // Bind tutorial clicks
        document.querySelectorAll('.tutorial-item').forEach(item => {
            item.addEventListener('click', () => {
                this.startTutorial(category, item.dataset.tutorial);
            });
            
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.startTutorial(category, item.dataset.tutorial);
                }
            });
        });

        // Scroll to top
        categoriesGrid.scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * Start a specific tutorial
     * @param {string} category - Category ID
     * @param {string} tutorialId - Tutorial ID
     */
    startTutorial(category, tutorialId) {
        const content = TutorialContent[category];
        const tutorial = content.tutorials.find(t => t.id === tutorialId);
        
        if (!tutorial) return;

        this.currentCategory = category;
        this.currentTutorial = tutorial;
        this.currentStep = 0;
        this.totalSteps = tutorial.steps;

        // Setup modal
        const modal = document.getElementById('tutorialModal');
        const title = document.getElementById('tutorial-title');
        const totalSteps = document.getElementById('totalSteps');
        const currentStep = document.getElementById('currentStep');

        title.textContent = tutorial.title;
        totalSteps.textContent = tutorial.steps;
        currentStep.textContent = '1';

        // Show modal
        modal.classList.remove('hidden');
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';

        // Render first step
        this.renderStep();

        // Focus on close button for accessibility
        document.getElementById('closeTutorial').focus();
    },

    /**
     * Render current step
     */
    renderStep() {
        const content = document.getElementById('tutorialContent');
        const step = this.currentTutorial.content[this.currentStep];
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const progressFill = document.getElementById('progressFill');
        const currentStepNum = document.getElementById('currentStep');

        // Update progress
        const progress = ((this.currentStep + 1) / this.totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
        currentStepNum.textContent = this.currentStep + 1;

        // Update navigation
        prevBtn.disabled = this.currentStep === 0;
        nextBtn.textContent = this.currentStep === this.totalSteps - 1 ? 'Finish' : 'Next →';

        // Render step content
        content.innerHTML = `
            <div class="tutorial-step active">
                <div class="step-header">
                    <span class="step-number">Step ${this.currentStep + 1}</span>
                    <h3 class="step-title">${step.title}</h3>
                </div>
                
                <p class="step-description">${step.description}</p>
                
                ${step.screenshot ? `
                    <div class="screenshot-container">
                        <div class="screenshot-placeholder" aria-label="${step.screenshot.alt}">
                            <p>${step.screenshot.placeholder}</p>
                        </div>
                        <p class="screenshot-caption">${step.screenshot.alt}</p>
                    </div>
                ` : step.illustration ? `
                    <div class="screenshot-container">
                        <p>${step.illustration}</p>
                    </div>
                ` : ''}
                
                <div class="step-action">
                    <h4>What to do:</h4>
                    <p>${step.action}</p>
                </div>
                
                <div class="key-point">
                    <span class="key-point-icon" aria-hidden="true">💡</span>
                    <div class="key-point-content">
                        <h4>Key Point</h4>
                        <p>${step.keyPoint}</p>
                    </div>
                </div>
            </div>
        `;

        // Announce step for screen readers
        this.announceStep();
    },

    /**
     * Navigate to next step
     */
    nextStep() {
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            this.renderStep();
        } else {
            this.showCompletion();
        }
    },

    /**
     * Navigate to previous step
     */
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderStep();
        }
    },

    /**
     * Show tutorial completion
     */
    showCompletion() {
        const content = document.getElementById('tutorialContent');
        content.innerHTML = `
            <div class="tutorial-complete">
                <div class="complete-icon" aria-hidden="true">🎉</div>
                <h2 class="complete-title">Congratulations!</h2>
                <p class="complete-message">You've completed this tutorial. Great job taking the time to learn!</p>
                <p>You now know how to ${this.currentTutorial.title.toLowerCase()}.</p>
                <div class="action-buttons mt-lg">
                    <button class="btn btn-secondary" onclick="location.reload()">
                        Browse More Tutorials
                    </button>
                    <button class="btn btn-primary" onclick="TutorialController.closeModal()">
                        Back to Learning Center
                    </button>
                </div>
            </div>
        `;

        // Update progress
        document.getElementById('progressFill').style.width = '100%';
        document.getElementById('currentStep').textContent = this.totalSteps;
        
        // Update navigation
        document.getElementById('prevStep').disabled = false;
        document.getElementById('nextStep').textContent = 'Done ✓';
        document.getElementById('nextStep').onclick = () => this.closeModal();

        // Read completion
        AudioController.speak('Congratulations! You have completed this tutorial. Great job!');
    },

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.getElementById('tutorialModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Stop any narration
        AudioController.stop();

        // Return to categories view
        location.reload();
    },

    /**
     * Read current step aloud
     */
    readStep() {
        const step = this.currentTutorial.content[this.currentStep];
        const text = `Step ${this.currentStep + 1}: ${step.title}. ${step.description}. Key point: ${step.keyPoint}`;
        AudioController.speak(text);
    },

    /**
     * Announce step for screen readers
     */
    announceStep() {
        const step = this.currentTutorial.content[this.currentStep];
        let announcement = `Step ${this.currentStep + 1} of ${this.totalSteps}: ${step.title}. ${step.description}`;
        
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        liveRegion.textContent = announcement;
        document.body.appendChild(liveRegion);
        
        setTimeout(() => liveRegion.remove(), 5000);
    }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio
    AudioController.init();
    
    // Initialize accessibility
    AccessibilityController.init();
    
    // Initialize tutorials
    TutorialController.init();
});
