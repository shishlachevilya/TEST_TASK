'use strict';

const data = [
    {
        id: '1',
        title: 'Овсяная каша с фруктами',
        src: 'i/im1.jpg',
        category: '1',
        price: '25'
    },
    {
        id: '2',
        title: 'Яичница глазунья с овощами на сковородке',
        src: 'i/im2.jpg',
        category: '1',
        price: '25'
    },
    {
        id: '3',
        title: 'Сет азербайджанский завтрак',
        src: 'i/im3.jpg',
        category: '1',
        price: '30'
    },
    {
        id: '4',
        title: 'Яичница с помидорами по-бакински',
        src: 'i/im4.jpg',
        category: '1',
        price: '45'
    },
    {
        id: '5',
        title: 'Сырники со сметаной',
        src: 'i/im5.jpg',
        category: '3',
        price: '45'
    },
    {
        id: '6',
        title: 'Шпинатный крем-суп',
        src: 'i/im6.jpg',
        category: '2',
        price: '45'
    },
    {
        id: '7',
        title: 'Суп Пити',
        src: 'i/im7.jpg',
        category: '2',
        price: '85'
    },
    {
        id: '8',
        title: 'Борщ украинский',
        src: 'i/im8.jpg',
        category: '2',
        price: '95'
    },
    {
        id: '9',
        title: 'Суп Кюфта Бозбаш',
        src: 'i/im9.jpg',
        category: '2',
        price: '100'
    },
    {
        id: '10',
        title: 'Картофель фри',
        src: 'i/im10.jpg',
        category: '3',
        price: '125'
    },
    {
        id: '11',
        title: 'Картофель по-домашнему',
        src: 'i/im11.jpg',
        category: '3',
        price: '135'
    },
    {
        id: '12',
        title: 'Рис с овощами',
        src: 'i/im12.jpg',
        category: '3',
        price: '150'
    }
];

const DEFAULT_VALUE = 'XXX';

const refs = {
    body: document.querySelector('body'),
    productsBox: document.querySelector('.products-box'),
    productBoxItems: document.querySelectorAll('.product-box__item'),
    categorySelect: document.querySelector('.select-box .select-control'),
    priceSelect: document.querySelector('.price-select-box .select-control'),
    basketCount: document.querySelector('.top-cart-info__item').firstElementChild,
    basketPrice: document.querySelector('.top-cart-info__item').lastElementChild,
    basketBtn: document.querySelector('.btn-check')
}

class Basket {
    constructor() {
        this.state = {
            count: 0,
            price: 0,
        }
        this.reg = {
            name: /^(?!\s*$).+/,
            email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        }
    }

    updateBasket(price, count) {
        this.state = {
            ...this.state,
            count: this.state.count += count,
            price: this.state.price += price * count
        }

        refs.basketCount.innerHTML = this.state.count;
        refs.basketPrice.innerHTML = this.state.price;
    }

    renderForm() {
        const popup = `
            <div class="popup">
                <form class="form">
                    <label class="form__label">
                        <input type="text" class="form__field" name="name" placeholder="Укажи имя"/>
                    </label>
                    <label class="form__label">
                        <input type="email" class="form__field" name="email" placeholder="Укажи емейл">
                    </label>
            
                    <div class="form__buttons">
                        <button type="button" class="forn__btn exit">Отмена</button>
                        <button type="submit" class="forn__btn send">Отправить</button>
                    </div>
                </form>
            </div>
        `

        refs.body.insertAdjacentHTML('beforeend', popup);
    }

    validation(type, value) {
        return this.reg[type].test(value);
    }

    sendEmail(name, email) {
        const isNameValid = this.validation('name', name);
        const isEmailValid = this.validation('email', email);
        
        if(isNameValid && isEmailValid) {
            document.querySelector('.popup').remove();
            
            refs.basketCount.innerHTML = DEFAULT_VALUE;
            refs.basketPrice.innerHTML = DEFAULT_VALUE;

            alert('Ваш заказ отправлен. Спасибо!');
        } else {
            alert('Заполни все поля!')
        }
    }
}

class List {
    constructor(array) {
        this.array = array;
        this.searchParams = {
            searchCategory: '0',
            searchPrice: '0'
        }
    }

    updateSearchParams(obj) {
        this.searchParams = {
            ...this.searchParams,
            [obj['type']]: obj.value
        }

        this.renderListItems();
    }

    renderItem(id, title, src, price) {
        return `
            <div id=${id} class="product-box__item">
                <h3 class="product-box__title">${title}</h3>
                <div class="product-box__img">
                    <img class="img-fluid" src="${src}" alt="${title}">
                </div>
                <div class="product-box__meta">
                    <p>${price} грн.</p>
                    <div class="qty">
                        <input class="qty__item" type="number"> Кол
                    </div>
                    <button class="product-box__btn">Добавить</button>
                </div>
            </div>
        `
    }

    renderListItems() {
        const {searchCategory, searchPrice} = this.searchParams;
        const isCategory = Boolean(+searchCategory);
        const isPrice = Boolean(+searchPrice);

        let template = '';
        
        if(isCategory && isPrice) {
            template = this.array.reduce((result, item) => {
                const {id, title, src, price, category} = item;

                if(category === searchCategory && +price <= +searchPrice) {
                    result += this.renderItem(id, title, src, price);
                }
                return result;
            }, '');
        } else if(isCategory) {
            template = this.array.reduce((result, item) => {
                const {id, title, src, price, category} = item;

                if(category === searchCategory) {
                    result += this.renderItem(id, title, src, price);
                }
                return result;
            }, '');
        } else if(isPrice) {
            template = this.array.reduce((result, item) => {
                const {id, title, src, price} = item;

                if(+price <= +searchPrice) {
                    result += this.renderItem(id, title, src, price);
                }
                return result;
            }, '');
        } else {
            this.array.map(({id, title, src, price}) => {
                template += this.renderItem(id, title, src, price);
            });
        }

        refs.productsBox && (refs.productsBox.innerHTML = template);
    }
}

const basket = new Basket();
const list = new List(data);

list.renderListItems();

refs.categorySelect.addEventListener('change', ({target}) => {
    list.updateSearchParams({
        type: 'searchCategory',
        value: target.value
    });
});

refs.priceSelect.addEventListener('change', ({target}) => {
    list.updateSearchParams({
        type: 'searchPrice',
        value: target.value
    });
});

refs.productsBox.addEventListener('click', ({target}) => {
    if(target.classList.contains('product-box__btn')) {
        const box = target.closest('.product-box__item');
        const paragraf = box.querySelector('.product-box__meta p');
        const count = box.querySelector('.qty .qty__item').value;

        const [price] = paragraf.innerHTML.split(' ');
        const isValidCount = Math.sign(count) === -1 || Math.sign(count) === 0;
                    
        if(isValidCount)  {
            alert('Укажи количество!');
            return;
        }

        basket.updateBasket(+price, +count);
    }
});

refs.basketBtn.addEventListener('click', () => {
    const isValid = refs.basketCount.innerHTML !== DEFAULT_VALUE && refs.basketPrice.innerHTML !== DEFAULT_VALUE;
    
    if(!isValid) {
        alert('Добавь продукт в корзину');
        return;
    }

    basket.renderForm();
});

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('exit')) {
        document.querySelector('.popup').remove();
    }

    if(e.target.classList.contains('send')) {
        e.preventDefault();
        const form = document.querySelector('.form');
        const name = form.elements[0].value;
        const email = form.elements[1].value;

        basket.sendEmail(name, email);
    }
});
