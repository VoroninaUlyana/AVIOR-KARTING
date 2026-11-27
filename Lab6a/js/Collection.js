class Collection {
    _objs;
    _schema;

    constructor(objs = [], schema = {}) {
        this._objs = [...objs];

        this._schema = {
            requiredFields: schema.requiredFields || ["id"],
            fields: schema.fields || null,
            validators: schema.validators || {},
            immutableFields: schema.immutableFields || [
                "id",
                "author",
                "createdAt"
            ]
        };

        // Проверка объектов при создании коллекции
        for (const obj of this._objs) {
            if (!this.validateObj(obj)) {
                throw new Error("Коллекция содержит некорректный объект");
            }
        }

        // Проверка уникальности ID
        const ids = this._objs.map(obj => obj.id);

        if (new Set(ids).size !== ids.length) {
            throw new Error("В коллекции обнаружены повторяющиеся ID");
        }
    }

    // Проверка объекта на валидность
    validateObj(obj) {
        if (
            obj === null ||
            typeof obj !== "object" ||
            Array.isArray(obj)
        ) {
            return false;
        }

        // Проверка обязательных полей
        for (const field of this._schema.requiredFields) {
            if (
                obj[field] === undefined ||
                obj[field] === null ||
                obj[field] === ""
            ) {
                return false;
            }
        }

        // ID должен быть строкой
        if (typeof obj.id !== "string") {
            return false;
        }

        // Проверка допустимых полей
        if (this._schema.fields) {
            for (const field of Object.keys(obj)) {
                if (!this._schema.fields.includes(field)) {
                    return false;
                }
            }
        }

        // Проверка форматов полей
        for (const field in this._schema.validators) {
            if (obj[field] !== undefined) {
                if (!this._schema.validators[field](obj[field])) {
                    return false;
                }
            }
        }

        return true;
    }

    // Получение объекта по ID
    getObj(id) {
        if (typeof id !== "string") {
            return null;
        }

        return this._objs.find(obj => obj.id === id) || null;
    }

    // Приватный по соглашению метод сравнения значений
    _compareValues(a, b) {
        if (a instanceof Date && b instanceof Date) {
            return a - b;
        }

        if (a === b) {
            return 0;
        }

        if (a === null || a === undefined) {
            return -1;
        }

        if (b === null || b === undefined) {
            return 1;
        }

        if (typeof a === "number" && typeof b === "number") {
            return a - b;
        }

        return String(a).localeCompare(String(b), "ru");
    }

    // Приватный по соглашению метод проверки фильтра
    _matchesFilter(obj, filterConfig) {
        for (const key in filterConfig) {
            if (key === "sortBy" || key === "sortOrder") {
                continue;
            }

            const condition = filterConfig[key];
            const value = obj[key];

            if (
                condition &&
                typeof condition === "object" &&
                !Array.isArray(condition) &&
                !(condition instanceof Date)
            ) {
                if (
                    condition.contains !== undefined &&
                    !String(value ?? "").toLowerCase()
                        .includes(String(condition.contains).toLowerCase())
                ) {
                    return false;
                }

                if (
                    condition.gte !== undefined &&
                    this._compareValues(value, condition.gte) < 0
                ) {
                    return false;
                }

                if (
                    condition.lte !== undefined &&
                    this._compareValues(value, condition.lte) > 0
                ) {
                    return false;
                }

                if (
                    condition.ne !== undefined &&
                    value === condition.ne
                ) {
                    return false;
                }

                if (
                    condition.in !== undefined &&
                    !condition.in.includes(value)
                ) {
                    return false;
                }

                continue;
            }

            if (Array.isArray(condition)) {
                if (!condition.includes(value)) {
                    return false;
                }
            } else if (
                value instanceof Date &&
                condition instanceof Date
            ) {
                if (value.getTime() !== condition.getTime()) {
                    return false;
                }
            } else if (value !== condition) {
                return false;
            }
        }

        return true;
    }

    // Получение объектов с фильтрацией, сортировкой и пагинацией
    getObjs(skip = 0, top = 10, filterConfig = {}) {
        if (
            !Number.isInteger(skip) ||
            !Number.isInteger(top) ||
            skip < 0 ||
            top < 0
        ) {
            return [];
        }

        if (
            filterConfig === null ||
            typeof filterConfig !== "object" ||
            Array.isArray(filterConfig)
        ) {
            return [];
        }

        let result = [...this._objs];

        // Фильтрация
        result = result.filter(obj =>
            this._matchesFilter(obj, filterConfig)
        );

        // Сортировка
        const sortBy = filterConfig.sortBy || "id";
        const sortOrder = filterConfig.sortOrder || "asc";

        result.sort((a, b) => {
            const comparison = this._compareValues(
                a[sortBy],
                b[sortBy]
            );

            return sortOrder === "desc"
                ? -comparison
                : comparison;
        });

        // Пагинация
        return result.slice(skip, skip + top);
    }

    // Добавление объекта
    addObj(obj) {
        if (!this.validateObj(obj)) {
            return false;
        }

        if (this._objs.some(item => item.id === obj.id)) {
            return false;
        }

        this._objs.push(obj);

        return true;
    }

    // Редактирование объекта
    editObj(id, changes) {
        if (
            typeof id !== "string" ||
            changes === null ||
            typeof changes !== "object" ||
            Array.isArray(changes)
        ) {
            return false;
        }

        const index = this._objs.findIndex(obj => obj.id === id);

        if (index === -1) {
            return false;
        }

        // Запрет изменения неизменяемых полей
        for (const field of this._schema.immutableFields) {
            if (
                Object.prototype.hasOwnProperty.call(changes, field) &&
                changes[field] !== this._objs[index][field]
            ) {
                return false;
            }
        }

        const updatedObj = {
            ...this._objs[index],
            ...changes
        };

        if (!this.validateObj(updatedObj)) {
            return false;
        }

        this._objs[index] = updatedObj;

        return true;
    }

    // Удаление объекта
    removeObj(id) {
        if (typeof id !== "string") {
            return false;
        }

        const index = this._objs.findIndex(obj => obj.id === id);

        if (index === -1) {
            return false;
        }

        this._objs.splice(index, 1);

        return true;
    }


    // Добавление массива объектов
    addAll(objs) {
        if (!Array.isArray(objs)) {
            return [];
        }

        const addedObjects = [];

        for (const obj of objs) {
            if (this.addObj(obj)) {
                addedObjects.push(obj);
            }
        }

        return addedObjects;
    }

    // Очистка коллекции
    clear() {
        this._objs = [];
        return true;
    }

    // Получение количества объектов
    getCount() {
        return this._objs.length;
    }

    // Проверка существования объекта
    hasObj(id) {
        return this._objs.some(obj => obj.id === id);
    }

}
