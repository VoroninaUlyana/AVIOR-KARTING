console.log("========== ПРОВЕРКА АИС КАРТИНГА ==========");

function check(name, condition) {
    console.log(
        `${condition ? "✅" : "❌"} ${name}: ${condition}`
    );
}

function checkFields(array, fields, name) {
    const result = Array.isArray(array) &&
        array.every(obj =>
            obj !== null &&
            typeof obj === "object" &&
            fields.every(field =>
                Object.prototype.hasOwnProperty.call(obj, field)
            )
        );

    check(`Структура ${name}`, result);
    return result;
}

function checkUniqueIds(array, name) {
    const ids = array.map(obj => obj.id);
    const result = ids.every(id =>
        typeof id === "string" && id.trim() !== ""
    ) && new Set(ids).size === ids.length;

    check(`Уникальные ID ${name}`, result);
    return result;
}

function checkReferences(array, field, referenceArray, name) {
    const result = array.every(obj =>
        obj[field] === null ||
        obj[field] === undefined ||
        referenceArray.some(ref => ref.id === obj[field])
    );

    check(name, result);
    return result;
}

function showCount(array, name) {
    console.log(`Количество ${name}: ${array.length}`);
}

// ==================================================
// 1. КОЛИЧЕСТВО ОБЪЕКТОВ
// ==================================================

console.log("\n--- 1. Количество объектов ---");

showCount(clientsData, "клиентов");
showCount(tracksData, "площадок");
showCount(kartsData, "картов");
showCount(trainersData, "тренеров");
showCount(bookingsData, "бронирований");
showCount(subscriptionsData, "абонементов");
showCount(vipStatusesData, "VIP-статусов");
showCount(equipmentData, "товаров");
showCount(paymentsData, "оплат");

// ==================================================
// 2. УНИКАЛЬНОСТЬ ID
// ==================================================

console.log("\n--- 2. Уникальность ID ---");

checkUniqueIds(clientsData, "клиентов");
checkUniqueIds(tracksData, "площадок");
checkUniqueIds(kartsData, "картов");
checkUniqueIds(trainersData, "тренеров");
checkUniqueIds(bookingsData, "бронирований");
checkUniqueIds(subscriptionsData, "абонементов");
checkUniqueIds(vipStatusesData, "VIP-статусов");
checkUniqueIds(equipmentData, "товаров");
checkUniqueIds(paymentsData, "оплат");

// ==================================================
// 3. ПРОВЕРКА СТРУКТУРЫ ОБЪЕКТОВ
// ==================================================

console.log("\n--- 3. Структура объектов ---");

checkFields(clientsData, [
    "id",
    "createdAt",
    "fullName",
    "phone"
], "клиентов");

checkFields(tracksData, [
    "id",
    "name",
    "address"
], "площадок");

checkFields(kartsData, [
    "id",
    "type",
    "trackId",
    "isAvailable"
], "картов");

checkFields(trainersData, [
    "id",
    "fullName",
    "specialization"
], "тренеров");

checkFields(bookingsData, [
    "id",
    "clientId",
    "trackId",
    "kartId",
    "dateTime",
    "status",
    "ridesCount",
    "rideDuration",
    "participantsCount",
    "trainingType",
    "trainerId",
    "price"
], "бронирований");

checkFields(subscriptionsData, [
    "id",
    "clientId",
    "validityDays",
    "ridesTotal",
    "ridesRemaining",
    "price",
    "startDate",
    "endDate"
], "абонементов");

checkFields(vipStatusesData, [
    "id",
    "discountPercent",
    "conditions"
], "VIP-статусов");

checkFields(equipmentData, [
    "id",
    "name",
    "price",
    "size",
    "stockQuantity"
], "товаров");

checkFields(paymentsData, [
    "id",
    "amount",
    "paymentMethod",
    "paymentDate",
    "paymentStatus",
    "targetType",
    "targetId"
], "оплат");

// ==================================================
// 4. ПРОВЕРКА СВЯЗЕЙ
// ==================================================

console.log("\n--- 4. Связи между объектами ---");

checkReferences(
    clientsData,
    "vipStatusId",
    vipStatusesData,
    "Все VIP-статусы клиентов существуют"
);

checkReferences(
    kartsData,
    "trackId",
    tracksData,
    "Все площадки картов существуют"
);

checkReferences(
    bookingsData,
    "clientId",
    clientsData,
    "Все клиенты бронирований существуют"
);

checkReferences(
    bookingsData,
    "trackId",
    tracksData,
    "Все площадки бронирований существуют"
);

checkReferences(
    bookingsData,
    "kartId",
    kartsData,
    "Все карты бронирований существуют"
);

checkReferences(
    bookingsData,
    "trainerId",
    trainersData,
    "Все назначенные тренеры существуют"
);

checkReferences(
    subscriptionsData,
    "clientId",
    clientsData,
    "Все клиенты абонементов существуют"
);

// ==================================================
// 5. ПРОВЕРКА ЗНАЧЕНИЙ
// ==================================================

console.log("\n--- 5. Проверка значений ---");

check(
    "Телефоны клиентов имеют строковый формат",
    clientsData.every(client =>
        typeof client.phone === "string" &&
        /^\+?\d{10,15}$/.test(client.phone)
    )
);

check(
    "Процент скидки VIP от 0 до 100",
    vipStatusesData.every(vip =>
        typeof vip.discountPercent === "number" &&
        vip.discountPercent >= 0 &&
        vip.discountPercent <= 100
    )
);

check(
    "Типы картов соответствуют варианту",
    kartsData.every(kart =>
        ["Детский", "Одиночный", "Для двоих"].includes(kart.type)
    )
);


check(
    "Цены товаров неотрицательные",
    equipmentData.every(item =>
        typeof item.price === "number" &&
        item.price >= 0
    )
);

check(
    "Количество товаров неотрицательное",
    equipmentData.every(item =>
        Number.isInteger(item.stockQuantity) &&
        item.stockQuantity >= 0
    )
);

check(
    "Цены бронирований неотрицательные",
    bookingsData.every(booking =>
        typeof booking.price === "number" &&
        booking.price >= 0
    )
);

// ==================================================
// 6. ПРОВЕРКА КОЛЛЕКЦИЙ
// ==================================================
const clientsCollection = new Collection(clientsData, {
    requiredFields: ["id", "createdAt", "fullName", "phone"],
    fields: ["id", "createdAt", "fullName", "phone", "vipStatusId"],
    immutableFields: ["id", "createdAt"],
    validators: {
        id: value => typeof value === "string",
        createdAt: value => value instanceof Date && !isNaN(value.getTime()),
        fullName: value => typeof value === "string" && value.trim().length > 0,
        phone: value => typeof value === "string" && /^\+?\d{10,15}$/.test(value),
        vipStatusId: value => value === null || typeof value === "string"
    }
});

console.log("\n--- 6. Проверка Collection ---");

check(
    "Получение существующего клиента",
    clientsCollection.getObj("CL-001") !== null
);

check(
    "Несуществующий клиент возвращает null",
    clientsCollection.getObj("CL-999") === null
);

const firstPage = clientsCollection.getObjs(0, 5);
const secondPage = clientsCollection.getObjs(5, 5);

check(
    "Пагинация: первая страница содержит 5 объектов",
    firstPage.length === 5
);

check(
    "Пагинация: вторая страница содержит 4 объекта",
    secondPage.length === 4
);

const filteredClients = clientsCollection.getObjs(0, 10, {
    fullName: { contains: "Иван" }
});

check(
    "Фильтрация клиентов по имени",
    filteredClients.every(client =>
        client.fullName.toLowerCase().includes("иван")
    )
);

const sortedClients = clientsCollection.getObjs(0, 9, {
    sortBy: "fullName",
    sortOrder: "asc"
});

const isSorted = sortedClients.every((client, index, array) =>
    index === 0 ||
    array[index - 1].fullName.localeCompare(
        client.fullName,
        "ru"
    ) <= 0
);

check("Сортировка клиентов по имени", isSorted);

const testClient = {
    id: "CL-TEST",
    createdAt: new Date(),
    fullName: "Тестовый клиент",
    phone: "+375291111111",
    vipStatusId: null
};

check(
    "Добавление нового клиента",
    clientsCollection.addObj(testClient)
);

check(
    "Запрет добавления повторяющегося ID",
    clientsCollection.addObj(testClient) === false
);

check(
    "Редактирование клиента",
    clientsCollection.editObj("CL-TEST", {
        fullName: "Изменённое имя"
    })
);

check(
    "Изменение ID запрещено",
    clientsCollection.editObj("CL-TEST", {
        id: "CL-NEW"
    }) === false
);

check(
    "Удаление клиента",
    clientsCollection.removeObj("CL-TEST")
);

check(
    "Удалённый клиент отсутствует",
    clientsCollection.getObj("CL-TEST") === null
);

console.log("\n--- Дополнительная проверка Collection ---");

const sortedByDate = clientsCollection.getObjs(
    0,
    9,
    { sortBy: "createdAt", sortOrder: "asc" }
);

check(
    "Сортировка по дате создания",
    sortedByDate.every((client, index, arr) =>
        index === 0 ||
        arr[index - 1].createdAt <= client.createdAt
    )
);

const vipClients = clientsCollection.getObjs(
    0,
    10,
    { vipStatusId: "VIP-001" }
);

check(
    "Фильтрация по VIP-статусу",
    vipClients.every(client =>
        client.vipStatusId === "VIP-001"
    )
);

const dateFiltered = clientsCollection.getObjs(
    0,
    10,
    {
        createdAt: {
            gte: new Date("2026-10-02"),
            lte: new Date("2026-10-04T23:59:59")
        }
    }
);

check(
    "Фильтрация по диапазону дат",
    dateFiltered.every(client =>
        client.createdAt >= new Date("2026-10-02") &&
        client.createdAt <= new Date("2026-10-04T23:59:59")
    )
);


console.log("\n--- Проверка дополнительных методов ---");

const testCollection = new Collection([
    { id: "T-001", name: "Тест 1" },
    { id: "T-002", name: "Тест 2" }
]);

console.log(
    "Начальное количество:",
    testCollection.getCount() === 2
);

console.log(
    "Проверка существующего ID:",
    testCollection.hasObj("T-001") === true
);

console.log(
    "Проверка отсутствующего ID:",
    testCollection.hasObj("T-999") === false
);

const added = testCollection.addAll([
    { id: "T-003", name: "Тест 3" },
    { id: "T-004", name: "Тест 4" },
    { id: "T-001", name: "Повтор" }
]);

console.log(
    "Добавлено два объекта:",
    added.length === 2
);

console.log(
    "Количество после добавления:",
    testCollection.getCount() === 4
);

testCollection.clear();

console.log(
    "Очистка коллекции:",
    testCollection.getCount() === 0
);



// ==================================================
// 7. АНАЛИТИКА
// ==================================================

const startDate = new Date("2026-01-01");
const endDate = new Date("2027-01-01");

const periodBookings = Report.getBookingsForPeriod(
    bookingsData,
    startDate,
    endDate
);

console.log(
    "Количество завершённых бронирований за период:",
    periodBookings.length
);

console.log(
    "Суммарное количество часов:",
    Report.getTotalHours(bookingsData, startDate, endDate)
);

console.log(
    "Среднее количество часов:",
    Report.getAverageHours(bookingsData, startDate, endDate)
);

console.log(
    "Количество ездивших людей:",
    Report.getRidersCount(bookingsData, startDate, endDate)
);

console.log(
    "Занятость площадок:",
    Report.getTrackOccupancy(bookingsData, startDate, endDate)
);

// ==========================================
// 7. ПРОВЕРКА ВСЕХ МЕТОДОВ И КОНСТРУКТОРОВ
// ==========================================

(function runAllMethodsTests() {
    console.log("\n========== 7. ПРОВЕРКА ВСЕХ МЕТОДОВ ==========");

    function check(name, condition) {
        console.log(
            `${condition ? "✅" : "❌"} ${name}: ${condition}`
        );
    }

    // ------------------------------------------
    // 8.1. Проверка конструкторов
    // ------------------------------------------

    console.log("\n--- 7.1. Проверка конструкторов ---");

    const testDate = new Date("2026-11-01T12:00:00");

    const testClient = new Client({
        id: "TEST-CL-001",
        fullName: "Тестовый Клиент",
        phone: "+375291234567"
    });

    check(
        "Создание клиента и присвоение свойств",
        testClient.id === "TEST-CL-001" &&
        testClient.fullName === "Тестовый Клиент" &&
        testClient.phone === "+375291234567" &&
        testClient.vipStatusId === null &&
        testClient.createdAt instanceof Date
    );

    const testBooking = new Booking({
        id: "TEST-B-001",
        author: "Администратор",
        clientId: "CL-001",
        trackId: "TR-001",
        kartId: "K-001",
        dateTime: testDate,
        ridesCount: 2,
        rideDuration: 10,
        participantsCount: 1,
        price: 30
    });

    check(
        "Создание бронирования и значения по умолчанию",
        testBooking.id === "TEST-B-001" &&
        testBooking.trainingType === "Без обучения" &&
        testBooking.trainerId === null &&
        testBooking.status === "Ожидает подтверждения" &&
        testBooking.ridesCount === 2
    );

    const testEquipment = new Equipment({
        id: "EQ-TEST",
        name: "Тестовый шлем",
        price: 50,
        size: "M",
        stockQuantity: 10
    });

    check(
        "Создание товара экипировки",
        testEquipment.id === "EQ-TEST" &&
        testEquipment.name === "Тестовый шлем" &&
        testEquipment.price === 50 &&
        testEquipment.stockQuantity === 10
    );

    const testKart = new Kart({
        id: "K-TEST",
        type: "Одиночный",
        trackId: "TR-001"
    });

    check(
        "Создание карта и значение isAvailable по умолчанию",
        testKart.id === "K-TEST" &&
        testKart.type === "Одиночный" &&
        testKart.trackId === "TR-001" &&
        testKart.isAvailable === true
    );

    const testPayment = new Payment({
        id: "PAY-TEST",
        amount: 100,
        paymentMethod: "Карта",
        paymentDate: testDate,
        paymentStatus: "Оплачено",
        targetType: "Booking",
        targetId: "TEST-B-001"
    });

    check(
        "Создание оплаты",
        testPayment.id === "PAY-TEST" &&
        testPayment.amount === 100 &&
        testPayment.paymentStatus === "Оплачено" &&
        testPayment.targetId === "TEST-B-001"
    );

    const testVIP = new VIPStatus({
        id: "VIP-TEST",
        discountPercent: 10,
        conditions: "Регулярные посещения"
    });

    check(
        "Создание VIP-статуса",
        testVIP.id === "VIP-TEST" &&
        testVIP.discountPercent === 10 &&
        testVIP.conditions === "Регулярные посещения"
    );

    const testTrainer = new Trainer({
        id: "TRN-TEST",
        fullName: "Тестовый Тренер",
        specialization: "Индивидуальное обучение"
    });

    check(
        "Создание тренера",
        testTrainer.id === "TRN-TEST" &&
        testTrainer.fullName === "Тестовый Тренер" &&
        testTrainer.specialization === "Индивидуальное обучение"
    );

    const testTrack = new Track({
        id: "TRACK-TEST",
        name: "Тестовая площадка",
        address: "Тестовый адрес"
    });

    check(
        "Создание площадки",
        testTrack.id === "TRACK-TEST" &&
        testTrack.name === "Тестовая площадка" &&
        testTrack.address === "Тестовый адрес"
    );

    const testSubscription = new Subscription({
        id: "SUB-TEST",
        clientId: "CL-001",
        validityDays: 30,
        ridesTotal: 10,
        ridesRemaining: 8,
        price: 200,
        startDate: new Date("2026-11-01"),
        endDate: new Date("2026-12-01")
    });

    check(
        "Создание абонемента",
        testSubscription.id === "SUB-TEST" &&
        testSubscription.clientId === "CL-001" &&
        testSubscription.ridesTotal === 10 &&
        testSubscription.ridesRemaining === 8 &&
        testSubscription.createdAt instanceof Date
    );


    // ------------------------------------------
    // 8.2. Проверка методов Collection
    // ------------------------------------------

    console.log("\n--- 7.2. Проверка методов Collection ---");

    const testCollection = new Collection(
        [
            { id: "C-001", name: "Анна", age: 20, active: true,
              createdAt: new Date("2026-01-01") },
            { id: "C-002", name: "Иван", age: 30, active: false,
              createdAt: new Date("2026-02-01") },
            { id: "C-003", name: "Мария", age: 25, active: true,
              createdAt: new Date("2026-03-01") }
        ],
        {
            requiredFields: ["id", "name"],
            fields: ["id", "name", "age", "active", "createdAt"],
            validators: {
                age: value => typeof value === "number" && value >= 0
            }
        }
    );

    check(
        "validateObj: корректный объект",
        testCollection.validateObj({
            id: "C-004",
            name: "Олег",
            age: 18
        })
    );

    check(
        "validateObj: объект без обязательного имени",
        testCollection.validateObj({
            id: "C-004",
            age: 18
        }) === false
    );

    check(
        "validateObj: ID неправильного типа",
        testCollection.validateObj({
            id: 123,
            name: "Олег"
        }) === false
    );

    check(
        "validateObj: передан null",
        testCollection.validateObj(null) === false
    );

    check(
        "validateObj: передан массив",
        testCollection.validateObj([]) === false
    );

    check(
        "validateObj: недопустимое поле",
        testCollection.validateObj({
            id: "C-004",
            name: "Олег",
            unknownField: "значение"
        }) === false
    );

    check(
        "validateObj: отрицательный возраст",
        testCollection.validateObj({
            id: "C-004",
            name: "Олег",
            age: -5
        }) === false
    );

    check(
        "getObj: получение существующего объекта",
        testCollection.getObj("C-001").name === "Анна"
    );

    check(
        "getObj: отсутствующий ID",
        testCollection.getObj("C-999") === null
    );

    check(
        "getObj: неправильный тип ID",
        testCollection.getObj(123) === null
    );

    check(
        "getObjs: получение всех объектов",
        testCollection.getObjs().length === 3
    );

    check(
        "getObjs: пагинация",
        testCollection.getObjs(1, 2).length === 2
    );

    check(
        "getObjs: нулевой размер страницы",
        testCollection.getObjs(0, 0).length === 0
    );

    check(
        "getObjs: отрицательное смещение",
        testCollection.getObjs(-1, 2).length === 0
    );

    check(
        "getObjs: неправильный тип фильтра",
        testCollection.getObjs(0, 10, null).length === 0
    );

    check(
        "getObjs: фильтр по точному значению",
        testCollection.getObjs(0, 10, {
            name: "Анна"
        }).length === 1
    );

    check(
        "getObjs: фильтр по массиву значений",
        testCollection.getObjs(0, 10, {
            name: ["Анна", "Мария"]
        }).length === 2
    );

    check(
        "getObjs: фильтр contains",
        testCollection.getObjs(0, 10, {
            name: { contains: "ан" }
        }).length === 2
    );

    check(
        "getObjs: фильтр gte",
        testCollection.getObjs(0, 10, {
            age: { gte: 25 }
        }).length === 2
    );

    check(
        "getObjs: фильтр lte",
        testCollection.getObjs(0, 10, {
            age: { lte: 20 }
        }).length === 1
    );

    check(
        "getObjs: фильтр ne",
        testCollection.getObjs(0, 10, {
            active: { ne: true }
        }).length === 1
    );

    check(
        "getObjs: фильтр in",
        testCollection.getObjs(0, 10, {
            age: { in: [20, 25] }
        }).length === 2
    );

    check(
        "getObjs: сортировка по имени по возрастанию",
        testCollection.getObjs(0, 10, {
            sortBy: "name",
            sortOrder: "asc"
        })[0].name === "Анна"
    );

    check(
        "getObjs: сортировка по имени по убыванию",
        testCollection.getObjs(0, 10, {
            sortBy: "name",
            sortOrder: "desc"
        })[0].name === "Мария"
    );

    check(
        "getObjs: фильтрация по дате",
        testCollection.getObjs(0, 10, {
            createdAt: new Date("2026-01-01")
        }).length === 1
    );

    check(
        "addObj: добавление корректного объекта",
        testCollection.addObj({
            id: "C-004",
            name: "Олег",
            age: 18
        })
    );

    check(
        "addObj: запрет повторного ID",
        testCollection.addObj({
            id: "C-004",
            name: "Другой Олег"
        }) === false
    );

    check(
        "addObj: запрет некорректного объекта",
        testCollection.addObj({
            id: "C-005",
            age: -10
        }) === false
    );

    check(
        "editObj: изменение существующего объекта",
        testCollection.editObj("C-004", {
            name: "Олег Смирнов"
        }) &&
        testCollection.getObj("C-004").name === "Олег Смирнов"
    );

    check(
        "editObj: запрет изменения ID",
        testCollection.editObj("C-004", {
            id: "C-999"
        }) === false
    );

    check(
        "editObj: запрет изменения createdAt",
        testCollection.editObj("C-004", {
            createdAt: new Date()
        }) === false
    );

    check(
        "editObj: запрет некорректного значения",
        testCollection.editObj("C-004", {
            age: -10
        }) === false
    );

    check(
        "editObj: отсутствующий ID",
        testCollection.editObj("C-999", {
            name: "Новое имя"
        }) === false
    );

    check(
        "editObj: некорректные изменения",
        testCollection.editObj("C-004", null) === false
    );

    check(
        "removeObj: удаление существующего объекта",
        testCollection.removeObj("C-004") &&
        testCollection.getObj("C-004") === null
    );

    check(
        "removeObj: удаление отсутствующего объекта",
        testCollection.removeObj("C-999") === false
    );

    check(
        "removeObj: неправильный тип ID",
        testCollection.removeObj(123) === false
    );

    const addedObjects = testCollection.addAll([
        { id: "C-005", name: "Пётр" },
        { id: "C-006", name: "Елена" },
        { id: "C-001", name: "Повтор" },
        { id: "C-007" }
    ]);

    check(
        "addAll: добавление корректных объектов",
        addedObjects.length === 2
    );

    check(
        "addAll: повторные и некорректные объекты пропущены",
        testCollection.getObj("C-005") !== null &&
        testCollection.getObj("C-006") !== null &&
        testCollection.getObj("C-007") === null
    );

    check(
        "addAll: передан не массив",
        testCollection.addAll(null).length === 0
    );

    check(
        "getCount: получение количества объектов",
        testCollection.getCount() === 5
    );

    check(
        "hasObj: существующий ID",
        testCollection.hasObj("C-001")
    );

    check(
        "hasObj: отсутствующий ID",
        testCollection.hasObj("C-999") === false
    );

    check(
        "hasObj: неправильный тип ID",
        testCollection.hasObj(123) === false
    );

    check(
        "clear: очистка коллекции",
        testCollection.clear() === true &&
        testCollection.getCount() === 0
    );


    // ------------------------------------------
    // 8.3. Проверка методов Report
    // ------------------------------------------

    console.log("\n--- 7.3. Проверка методов Report ---");

    const startDate = new Date("2026-01-01T00:00:00");
    const endDate = new Date("2026-12-31T23:59:59");

    const completedBookings = Report.getBookingsForPeriod(
        bookingsData,
        startDate,
        endDate
    );

    check(
        "getBookingsForPeriod: возвращает завершённые бронирования",
        completedBookings.every(
            booking => booking.status === "Завершено"
        )
    );

    check(
        "getBookingsForPeriod: бронирования входят в период",
        completedBookings.every(
            booking =>
                booking.dateTime >= startDate &&
                booking.dateTime <= endDate
        )
    );

    check(
        "getBookingsForPeriod: пустой период",
        Report.getBookingsForPeriod(
            bookingsData,
            new Date("2020-01-01"),
            new Date("2020-01-02")
        ).length === 0
    );

    check(
        "getTotalHours: результат неотрицательный",
        Report.getTotalHours(
            bookingsData,
            startDate,
            endDate
        ) >= 0
    );

    check(
        "getTotalHours: пустой массив",
        Report.getTotalHours(
            [],
            startDate,
            endDate
        ) === 0
    );

    check(
        "getAverageHours: результат неотрицательный",
        Report.getAverageHours(
            bookingsData,
            startDate,
            endDate
        ) >= 0
    );

    check(
        "getAverageHours: нет бронирований",
        Report.getAverageHours(
            [],
            startDate,
            endDate
        ) === 0
    );

    check(
        "getRidersCount: результат неотрицательный",
        Report.getRidersCount(
            bookingsData,
            startDate,
            endDate
        ) >= 0
    );

    check(
        "getRidersCount: пустой массив",
        Report.getRidersCount(
            [],
            startDate,
            endDate
        ) === 0
    );

    const occupancy = Report.getTrackOccupancy(
        bookingsData,
        startDate,
        endDate
    );

    check(
        "getTrackOccupancy: возвращает массив",
        Array.isArray(occupancy)
    );

    check(
        "getTrackOccupancy: содержит интервалы занятости",
        occupancy.every(item =>
            item.trackId &&
            item.kartId &&
            item.start instanceof Date &&
            item.end instanceof Date &&
            item.end >= item.start
        )
    );

    check(
        "getTrackOccupancy: пустой массив",
        Report.getTrackOccupancy(
            [],
            startDate,
            endDate
        ).length === 0
    );

    console.log("\n========== ПРОВЕРКА МЕТОДОВ ЗАВЕРШЕНА ==========");
})();