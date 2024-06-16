const initDictionary = () => {
    const engWord = document.getElementById('eng'),
        rusWord = document.getElementById('rus'),
        addButton = document.getElementById('add-word-btn'),
        message = document.getElementById('message-text'),
        inputs = document.getElementsByClassName('input'),
        table = document.getElementById('table');
    
    const dictionary = localStorage.getItem('words');
    let words = {};
    if (dictionary) {
        words = JSON.parse(dictionary);
    }

    // Функция для добавления слов в localStorage
    const flushWords = words => {
        localStorage.setItem('words', JSON.stringify(words));
    }

    addButton.addEventListener('click', () => {
        message.innerHTML = '';
        if (engWord.value.length == 0 || rusWord.value.length == 0 || !isNaN(engWord.value) || !isNaN(rusWord.value)) {
            for (let key of inputs) {
                key.classList.add('error');
            }
            return;
        }
        
        for (let key of inputs) {
            key.classList.remove('error');
        }

        if (!words[engWord.value]) { // Проверка на уникальность слова
            words[engWord.value] = [rusWord.value];
            flushWords(words);
            addWordToTable(engWord.value, rusWord.value);
        } else if(words[engWord.value] && !words[engWord.value].includes(rusWord.value)){
            // Если слово уже существует, и такого перевода еще нет, добавляем русский перевод в массив
            words[engWord.value].push(rusWord.value);
            flushWords(words);
            addWordToTable(engWord.value, rusWord.value);
        } else {
            message.innerHTML = 'Такой перевод для этого слова уже существует';
        }
        engWord.value = null;
        rusWord.value = null;
    });

    const deleteWord = word => {
        if (words[word]) {
            delete words[word];
            flushWords(words);
        }
    };

    // Функция добавления события удаления
    const addEventDelete = () => {
        if(words){
            const deleteButtons = document.querySelectorAll('.btn-delete');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const row = btn.parentNode.parentNode;
                    const engCell = row.querySelector('.eng-word');
                    deleteWord(engCell.textContent);
                    row.remove();
                });
            });
        }
    };

    // Функция добавления слова в таблицу
    const addWordToTable = (eng, rus) => {
        const existingRow = document.querySelector(`tr[data-eng="${eng}"]`);
    
        if (existingRow) {
            // Если строка для этого английского слова уже существует, добавляем новый русский перевод
            const rusCell = existingRow.querySelector('.rus-word');
            rusCell.textContent += `, ${rus}`; // Добавлен пробел после запятой
        } else {
            table.innerHTML += `
                <tr class="tr" data-eng=${eng}>
                    <td class="eng-word">${eng}</td>
                    <td class="rus-word">${rus}</td>
                    <td class="button">
                        <button class="btn-delete"></button>
                    </td>
                </tr>
            `;
            addEventDelete();
        }
    };

    const sortWordsAndAddToTable = () => {
        table.innerHTML = '';
        const sortedKeys = Object.keys(words).sort();
        sortedKeys.forEach(key => {
            const rusWords = words[key];
            rusWords.forEach(rusWord => {
                addWordToTable(key, rusWord);
            });
        });
    };

    sortWordsAndAddToTable();

    const getTranslationButton = document.getElementById('get-translation-btn');
    getTranslationButton.addEventListener('click', () => {
        message.innerHTML = '';
        if (engWord.value.length == 0 || !isNaN(engWord.value)) {
            engWord.classList.add('error');
            return;
        }
        engWord.classList.remove('error');
        
        if (words[engWord.value]) {
            message.innerHTML = 'Перевод: ' + words[engWord.value].join(', ');
        } else {
            message.innerHTML = 'Перевод для этого слова не найден.';
        }
    });
};

initDictionary();
