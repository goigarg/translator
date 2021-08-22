

    https.get(url, (response) => {
        response.on('data', (data) => {
            let langData = JSON.parse(data);
            console.log(langData.text);
            var text = langData.text;
            res.render('res', {translation: text});
        });
    });