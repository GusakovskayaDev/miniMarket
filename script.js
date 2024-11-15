
const manageData = {
	data: [],

	// Асинхронная функция для получения данных из JSON файла
	async getJson(file) {
		try {
			const response = await fetch(file);
			if (!response.ok) {
				throw new Error(`Ошибка загрузки: ${response.statusText}`);
			}
			const data = await response.json();
			return data; // Возвращаем данные, чтобы использовать их дальше
		} catch (error) {
			console.error("Ошибка при получении данных:", error);
			throw error;
		}
	},

	async loadData() {
		try {
			// Загружаем данные из файла
			const data = await this.getJson('anotherData.json');
			
			// Передаем данные в разные функции
			this.outPutCategory(data);
			this.outPutProducts(data);
		} catch (error) {
			console.error("Ошибка при загрузке данных:", error);
		}
	},

	// Метод вывода категорий товара
	 outPutCategory(data) {
		const ul = document.createElement('ul');
		const fragment = document.createDocumentFragment();

		data.forEach(element => {
				const li = document.createElement('li');
				li.classList.add('li');

				const a = document.createElement('a');
				a.classList.add('menuItem', `link-${element.category}`);
				a.dataset.category = element.category;
				a.textContent = element.category;

				li.appendChild(a);
				fragment.appendChild(li);
		});

		ul.appendChild(fragment);
		nav.appendChild(ul);

		this.activeDefault();
		addEventListeners.eventClickOnCategory();
	},

	// Метод вывода продуктов
	outPutProducts(data) {
		data.forEach(category => {
			const section = document.getElementById(category.category);

			const fragmentDivProduct = document.createDocumentFragment();
			const fragmentSection = document.createDocumentFragment();

			category.products.forEach(product => {
				// Создаем контейнер продукта, задаем dataset и добавляем класс
				const divProduct = document.createElement('div');
				divProduct.classList.add('divProduct');
				divProduct.dataset.name = product.name;
				divProduct.dataset.price = product.price;
				divProduct.dataset.img = product.img;

				// Создаем остальные элементы и присваиваем им значения из объекта
				const title = document.createElement('h3');
				const price = document.createElement('p');
				const img = document.createElement('img');
				title.textContent = product.name;
				price.textContent = product.price;
				img.src = product.img;

				// Присваиваем элементы в фрагмент, чтобы не создавать лишних узлов
				fragmentDivProduct.appendChild(title);
				fragmentDivProduct.appendChild(img);
				fragmentDivProduct.appendChild(price);

				divProduct.appendChild(fragmentDivProduct);
				fragmentSection.appendChild(divProduct);
			});
			// Один раз используем appendChild без лишних узлов
			section.appendChild(fragmentSection);
		});

		addEventListeners.eventOnProductCard();
	},

	// Устанавливает отображение товара и делает ссылку активной по умолчанию после перезагрузки страницы
	activeDefault(){
		const linkFruits = document.querySelector('.link-fruits');
		linkFruits.classList.add('active');

		const sectionFruits = document.getElementById('fruits');
		sectionFruits.classList.add('displayBlock');
	}
}

const cartMethods = {
	cart: [],

	downloadCart(){
		const downloadData = localStorage.getItem('productCart');
    this.cart = downloadData ? JSON.parse(downloadData) : [];
	},

	// Добавление продукта в корзину
	addProduct(card){
		// Берем необходимые атрибуты из элемента
		const nameAttribute = card.dataset.name;
		const priceAttribute = card.dataset.price;
		const imgAttribute = card.dataset.img;

		// Создаем объект для добавления
		const addData = {
			'name': nameAttribute,
			'price': priceAttribute,
			'img': imgAttribute,
			'count': 1
		};

    // Проверяем, пустая ли корзина
    if (this.cart.length === 0) {
        // Если пустая, просто добавляем первый элемент
        this.cart.push(addData);
    } else {
        // Если не пустая, ищем элемент с таким же именем
        const existingProduct = this.cart.find(item => item.name === nameAttribute);

        if (existingProduct) {
            // Если такой продукт уже есть, увеличиваем его count
            existingProduct.count += 1;
        } else {
            // Если нет, добавляем как новый элемент
            this.cart.push(addData);
        }
    }

    // Сохраняем продукт
    this.saveProduct();
	},

	searchProduct(){

	},

	saveProduct(){
		localStorage.setItem('productCart', JSON.stringify(this.cart));
	},

	outPutDataInCart(){
		const someProducts = document.querySelector('.someProducts');
		someProducts.innerHTML = '';

		this.cart.forEach(product => {
			const index = cartMethods.cart.findIndex(element => element.name === product.name);

			const eachProducts = document.createElement('div');
			eachProducts.classList.add('eachProducts');

			const image = document.createElement('img');
			image.src = product.img;
			image.alt = product.name;
			image.classList.add('imageCart');

			const rightSide = document.createElement('div');
			rightSide.classList.add('rightSide');

			const title = document.createElement('h2');
			title.innerHTML = product.name;
			const price = document.createElement('p');
			price.classList.add(`index-price-${index}`);
			price.innerHTML = product.price;

			const divQuantity = document.createElement('div');
			divQuantity.classList.add('divQuantity');
			
			const Quantity = document.createElement('input');
			Quantity.classList.add('quantity', `index-${index}`);
			Quantity.setAttribute('min', '1');
			Quantity.setAttribute('type', 'text');
			Quantity.setAttribute('readonly', '');
			Quantity.value = product.count;

			const inc = document.createElement('button');
			inc.innerHTML = '+';
			inc.classList.add('inc');
			inc.setAttribute('nameProduct', product.name);
			const dec = document.createElement('button');
			dec.innerHTML = '-';
			dec.classList.add('dec');
			dec.setAttribute('nameProduct', product.name);

			const ph2Summa = document.createElement('h2');
			const summa = product.price * product.count;
			ph2Summa.innerHTML = summa;
			ph2Summa.classList.add(`index-count-${index}`);

			const deleteButton = document.createElement('button');
			deleteButton.innerHTML = 'X';
			deleteButton.classList.add('deleteButton', `index-delete-${index}`);
			deleteButton.setAttribute('nameProduct', product.name);

			divQuantity.appendChild(dec);
			divQuantity.appendChild(Quantity);
			divQuantity.appendChild(inc);

			rightSide.appendChild(title);
			rightSide.appendChild(divQuantity);
			rightSide.appendChild(price);
			rightSide.appendChild(ph2Summa);

			rightSide.appendChild(deleteButton);

			eachProducts.appendChild(image);
			eachProducts.appendChild(rightSide);

			someProducts.appendChild(eachProducts);
		})
	},
	openCart(){
		const cart_area = document.querySelector('.cart_area');
		cart_area.classList.add('displayBlock');
	},

	closeCart(){
		const cart_area = document.querySelector('.cart_area');
		cart_area.classList.remove('displayBlock');
	},

	productQuantity(){
		const labelQuantity = document.querySelector('.labelQuantity');
		let allQuantity = 0;

		this.cart.forEach(element => {
				allQuantity += element.count; 
		});

		labelQuantity.innerHTML = allQuantity;
	},

	summAllProducts(){
		const summAllProducts = document.querySelector('.summAllProducts');
		const summa = document.querySelectorAll('.summa');
		let itogo = 0;
		let multip = 0;
		this.cart.forEach(element => {
			const count = Number(element.count);
			const price = Number(element.price);
			multip = count * price;
			itogo += multip;
		})
		summAllProducts.innerHTML = itogo;
	}
}

// Модуль прослушивателей событий
const addEventListeners = {

	eventClickOnCategory(){
		const menuItems = document.querySelectorAll('.menuItem');
		menuItems.forEach(element => {
			const sections = document.querySelectorAll('.section');
			const section = document.getElementById(element.innerHTML);
			element.addEventListener('click', function() {
				menuItems.forEach(item => item.classList.remove('active'));
				this.classList.add('active');
				sections.forEach(item => item.classList.remove('displayBlock'));
				section.classList.add('displayBlock');
			});
		});
	},

	// Событие на нажатие по карточке продукта
	eventOnProductCard(){
		const divProducts = document.querySelectorAll('.divProduct');
		divProducts.forEach(card => {
			card.addEventListener('click', function() {
				cartMethods.addProduct(card);
				cartMethods.productQuantity();
				cartMethods.summAllProducts();
			});
		});
	},

	// Событие по нажатию на иконку корзины
	eventOnOpenCart(){
		const cartIcon = document.querySelector('.cartIcon');
		cartIcon.addEventListener('click', function() {
			cartMethods.openCart();
			cartMethods.outPutDataInCart();
			addEventListeners.eventIncrement();
			addEventListeners.eventDecrement();
			addEventListeners.eventDeleteFromCart();
			addEventListeners.eventCloseCartArea();
			addEventListeners.eventOnCloseCart();
		})
	},

	// Событие по нажатию на иконку крестика в поп-ап окне корзины
	eventOnCloseCart(){
		const closeCart = document.querySelector('.closeCart');
		closeCart.addEventListener('click', function() {
			cartMethods.closeCart();
		});
	},

	// Закрываем окно по нажатию на область
	eventCloseCartArea(){
		const cart_area = document.querySelector('.cart_area');
		const cart_Container = document.querySelector('.cart_Container');
		document.addEventListener('mousedown', (event) => {
			if (!cart_Container.contains(event.target)) {
				cart_area.classList.remove('displayBlock');
			}
		});
	},

	// Нажимаем по кнопке Инкремент
	eventIncrement(){
		const inc = document.querySelectorAll('.inc');
		inc.forEach(button => {
			button.addEventListener('click', () => {
				const nameProduct = button.getAttribute('nameProduct');
				const index = cartMethods.cart.findIndex(element => element.name === nameProduct);
				const condition = cartMethods.cart[index].count + 1 >= 20 
				if(condition){
					return;
				}
				cartMethods.cart[index].count += 1;
				cartMethods.saveProduct();
				const input = document.querySelector(`.index-${index}`);
				input.value = cartMethods.cart[index].count;
				const summa = document.querySelector(`.index-count-${index}`);
				const price = document.querySelector(`.index-price-${index}`);
				const count = cartMethods.cart[index].count;
				summa.innerHTML = price.innerHTML * count;
				cartMethods.summAllProducts();
				cartMethods.productQuantity();
			});
		});
	},

	eventDecrement(){
		const dec = document.querySelectorAll('.dec');
		dec.forEach(button => {
			button.addEventListener('click', () => {
				const nameProduct = button.getAttribute('nameProduct');
				const index = cartMethods.cart.findIndex(element => element.name === nameProduct);
				const condition = cartMethods.cart[index].count - 1 <= 0 
				if(condition){
					return;
				}
				cartMethods.cart[index].count -= 1;
				cartMethods.saveProduct();
				const input = document.querySelector(`.index-${index}`);
				input.value = cartMethods.cart[index].count;
				const summa = document.querySelector(`.index-count-${index}`);
				const price = document.querySelector(`.index-price-${index}`);
				const count = cartMethods.cart[index].count;
				summa.innerHTML = price.innerHTML * count;
				cartMethods.summAllProducts();
				cartMethods.productQuantity();
			});
		});
	},

	eventDeleteFromCart(){
		const deleteButton = document.querySelectorAll('.deleteButton');
		deleteButton.forEach(button => {
			button.addEventListener('click', () => {
				const nameProduct = button.getAttribute('nameProduct');
				const index = cartMethods.cart.findIndex(element => element.name === nameProduct);
				if (index !== -1) {
					cartMethods.cart.splice(index, 1);
					cartMethods.saveProduct();
					cartMethods.outPutDataInCart();
					this.eventDeleteFromCart();
					addEventListeners.eventIncrement();
					addEventListeners.eventDecrement();
					cartMethods.summAllProducts();
					cartMethods.productQuantity();
				}
			});
		});
	}
}

// Вызываю функцию для получения данных из файла JSON и последующего отображения этих данных на странице
manageData.loadData();

cartMethods.downloadCart();
addEventListeners.eventOnOpenCart();
cartMethods.productQuantity();
cartMethods.summAllProducts();
