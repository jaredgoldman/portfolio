# My Portfolia Site

Hey, this is my little portfolio site. An attempt at using the platform (plus a CSS pre-processor... sorry not sorry). It's basically vanilla CSS/HTML/JS SPA that features a hand-made carousel and is powered
by a Strapi backend somewhere in the cloud. Come in, stay for a while and let me know if you like it. Now I'm going to go actually build some projects to showcase here, wish me luck!

Thanks,
JG

## Build command (Netlify)

Because I'm using Vanilla JS, CSS and HTML, we don't have access to a build step that will inject our env variables into the app runtime. Therefore, we'll utilize Netlify's build command
functionality to insert a `.gitignore`'d file called `config.js` that will include our env variables:

```sh
echo -e "const API_URL = '<API_URL>';\nconst API_KEY = '<API_KEY>';\n\nexport { API_URL, API_TOKEN };" > config.js
```
