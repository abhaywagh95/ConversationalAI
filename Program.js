const { GetApiCall } = require('./Common');

/**
* Function which read the files and returns first row of file.
* @return {Array|string}
*/
async function ReadFileFromUrl() {
    try {
        const responseData = await GetApiCall('get', 'http://norvig.com/', 'big.txt', null, null);

        if (responseData.status == 200) {
            var textData = responseData.data;
            const splitedText = textData.split(/\r?\n/);
            return splitedText[0];
        }

        return "error"
    } catch (error) {

        return "error"
    }
}


/**
* Function which call the Dictionary and return formatted output
* @return {Object}
*/
async function ManageData() {    
    const text = await ReadFileFromUrl();

    if(text == 'error')
        return;

    const chars = text.split(' ');
    let objectModel = [];

    for (let i = 0; i < chars.length; i++) {
        const obj = await CallDictionary(chars[i]);

        objectModel.push(obj);
    }

    console.log(JSON.stringify(objectModel));
    
    return objectModel;
}

/**
* Function which call the Dictionary Api and return formatted output
* @return {Object}
*/
async function CallDictionary(text) {
    try {
        const returnObject = {
        };

        const params = {
            key: 'dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9',
            lang: 'en-en',
            text: text
        }
        const response = await GetApiCall('get', 'https://dictionary.yandex.net/', 'api/v1/dicservice.json/lookup?', params, null);

        if (response.status == 200) {
            const responseObject = response.data;
            const def = responseObject.def;

            returnObject.Word = text;

            if (def.length > 0) {
                returnObject.Count = def.length;
                returnObject.Pos = def.map(data => data.pos).join(',');
                const tr = def.map(data => data.tr);
                returnObject.Synonyms = await ReadElementForSyn(tr[0]);
            } else {
                returnObject.Count = 0;
                returnObject.Pos = null,
                    returnObject.Synonyms = null;
            }
        }
        else {
            returnObject.Word = text;
            returnObject.Count = 0;
            returnObject.Pos = null;
            returnObject.Synonyms = null;
        }

        return returnObject;
    } catch (error) {
        return {
            error: 'Error While processing the text'
        };
    }
}

/**
* Function to get formatted output for Synonyms
* @param {object} data
* @return {Object}
*/
async function ReadElementForSyn(data) {
    let array = [];

    for (let i = 0; i < data.length; i++) {
        let val = data[i].syn;
        if (val) {
            array.push(val);
        }
    }

    if (array.length > 0)
        return array;
    else
        return null;
}

ManageData();
