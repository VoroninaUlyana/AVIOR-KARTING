(function () {
    "use strict";

    const user = "Администратор";

    const clientsCollection = new Collection(clientsData, {
        requiredFields: ["id", "fullName", "phone"],
        fields: [
            "id",
            "createdAt",
            "fullName",
            "phone",
            "vipStatusId"
        ],
        validators: {
            fullName: value =>
                typeof value === "string" && value.trim() !== "",
            phone: value =>
                typeof value === "string" && value.trim() !== ""
        }
    });

    const clientView = new ClientView("clientsContainer");

    let currentFilter = "all";
    let currentSearch = "";

    function getClients() {
        let clients = clientsCollection.getObjs(
            0,
            clientsCollection.getCount()
        );

        if (currentFilter === "vip") {
            clients = clients.filter(client => Boolean(client.vipStatusId));
        }

        if (currentFilter === "regular") {
            clients = clients.filter(client => !client.vipStatusId);
        }

        if (currentSearch) {
            const query = currentSearch.toLocaleLowerCase("ru");

            clients = clients.filter(client => {
                const searchableText = [
                    client.id,
                    client.fullName,
                    client.phone,
                    client.vipStatusId || ""
                ].join(" ").toLocaleLowerCase("ru");

                return searchableText.includes(query);
            });
        }

        return clients;
    }


    function getStats() {
        const clients = clientsCollection.getObjs(
            0,
            clientsCollection.getCount()
        );

        const vipCount = clients.filter(
            client => Boolean(client.vipStatusId)
        ).length;

        return {
            total: clients.length,
            vip: vipCount,
            regular: clients.length - vipCount
        };
    }

    function updateView() {
        clientView.render(
            getClients(),
            user,
            getStats(),
            currentFilter,
            currentSearch
        );
    }

    function addObj(obj) {
        if (!user) {
            console.warn("Для добавления клиента необходима авторизация.");
            return false;
        }

        const result = clientsCollection.addObj(obj);

        if (result) {
            updateView();
            console.log("Клиент добавлен.");
        } else {
            console.warn("Не удалось добавить клиента. Проверьте данные и ID.");
        }

        return result;
    }

    function removeObj(id) {
        if (!user) {
            console.warn("Для удаления клиента необходима авторизация.");
            return false;
        }

        const result = clientsCollection.removeObj(id);

        if (result) {
            updateView();
            console.log("Клиент удалён.");
        } else {
            console.warn("Клиент не найден или не удалось его удалить.");
        }

        return result;
    }

    function editObj(id, changes) {
        if (!user) {
            console.warn("Для редактирования необходима авторизация.");
            return false;
        }

        const result = clientsCollection.editObj(id, changes);

        if (result) {
            updateView();
            console.log("Данные клиента изменены.");
        } else {
            console.warn("Не удалось изменить данные клиента.");
        }

        return result;
    }

    function filterClients(filter) {
        const allowedFilters = ["all", "vip", "regular"];

        if (!allowedFilters.includes(filter)) {
            console.warn("Доступные фильтры: all, vip, regular");
            return false;
        }

        currentFilter = filter;
        updateView();

        return true;
    }

    function searchClients(query) {
        if (typeof query !== "string") {
            console.warn("Поисковый запрос должен быть строкой.");
            return false;
        }

        currentSearch = query.trim();
        updateView();

        return true;
    }

    window.addObj = addObj;
    window.removeObj = removeObj;
    window.editObj = editObj;
    window.filterClients = filterClients;
    window.searchClients = searchClients;
    window.getClients = getClients;

    updateView();

    console.log("AVIOR: управление клиентами загружено.");
    console.log(
        "Доступные функции: addObj, removeObj, editObj, filterClients, searchClients, getClients"
    );
})();