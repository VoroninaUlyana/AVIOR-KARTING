class ClientView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);

        if (!this.container) {
            throw new Error(`Контейнер ${containerId} не найден`);
        }
    }

    createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    render(clients, user, stats, currentFilter, currentSearch) {
        this.container.replaceChildren();

        // Информация о пользователе
        const userInfo = this.createElement(
            "p",
            "clients-user-info",
            user ? `Пользователь: ${user}` : "Вы не авторизованы"
        );

        this.container.appendChild(userInfo);

        // Статистика
        const statistics = this.createElement(
            "div",
            "clients-statistics"
        );

        const statItems = [
            { label: "Всего клиентов", value: stats.total },
            { label: "VIP-клиентов", value: stats.vip },
            { label: "Обычных клиентов", value: stats.regular }
        ];

        statItems.forEach(item => {
            const card = this.createElement("div", "clients-stat-card");

            card.appendChild(
                this.createElement("span", "", item.label)
            );

            card.appendChild(
                this.createElement("strong", "", item.value)
            );

            statistics.appendChild(card);
        });

        this.container.appendChild(statistics);

        // Панель управления
        if (user) {
            const controls = this.createElement(
                "div",
                "clients-controls"
            );

            const addButton = this.createElement(
                "button",
                "clients-button clients-button-primary",
                "+ Добавить клиента"
            );

            addButton.type = "button";
            addButton.disabled = true;

            const searchInput = this.createElement("input");
            searchInput.type = "search";
            searchInput.placeholder = "Поиск по имени, ID или телефону...";
            searchInput.value = currentSearch;
            searchInput.disabled = true;

            const searchButton = this.createElement(
                "button",
                "clients-button",
                "Найти"
            );

            searchButton.type = "button";
            searchButton.disabled = true;

            const filterSelect = this.createElement("select");
            filterSelect.disabled = true;

            [
                { value: "all", text: "Все клиенты" },
                { value: "vip", text: "VIP-клиенты" },
                { value: "regular", text: "Без VIP-статуса" }
            ].forEach(filter => {
                const option = this.createElement(
                    "option",
                    "",
                    filter.text
                );

                option.value = filter.value;
                option.selected = filter.value === currentFilter;

                filterSelect.appendChild(option);
            });

            controls.append(
                addButton,
                searchInput,
                searchButton,
                filterSelect
            );

            this.container.appendChild(controls);

            this.container.appendChild(
                this.createElement(
                    "p",
                    "clients-instruction",
                    "Управление данными выполняется через функции консоли браузера."
                )
            );
        }

        // Таблица клиентов
        const tableWrapper = this.createElement(
            "div",
            "clients-table-wrapper"
        );

        const table = this.createElement(
            "table",
            "clients-table"
        );

        const thead = this.createElement("thead");
        const headerRow = this.createElement("tr");

        ["ID", "ФИО", "Телефон", "Статус", "Действия"].forEach(title => {
            headerRow.appendChild(
                this.createElement("th", "", title)
            );
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = this.createElement("tbody");

        if (clients.length === 0) {
            const row = this.createElement("tr");
            const cell = this.createElement(
                "td",
                "clients-empty",
                "Клиенты не найдены."
            );

            cell.colSpan = 5;
            row.appendChild(cell);
            tbody.appendChild(row);
        }

        clients.forEach(client => {
            const row = this.createElement("tr");

            row.appendChild(
                this.createElement("td", "client-id", client.id)
            );

            row.appendChild(
                this.createElement("td", "client-name", client.fullName)
            );

            row.appendChild(
                this.createElement("td", "client-phone", client.phone)
            );

            row.appendChild(
                this.createElement(
                    "td",
                    client.vipStatusId ? "vip-status" : "regular-status",
                    client.vipStatusId
                        ? `VIP · ${client.vipStatusId}`
                        : "Обычный"
                )
            );

            const actions = this.createElement(
                "td",
                "client-actions"
            );

            if (user) {
                const editButton = this.createElement(
                    "button",
                    "clients-button",
                    "Изменить"
                );

                editButton.type = "button";
                editButton.disabled = true;

                const deleteButton = this.createElement(
                    "button",
                    "clients-button clients-button-danger",
                    "Удалить"
                );

                deleteButton.type = "button";
                deleteButton.disabled = true;

                actions.append(editButton, deleteButton);
            } else {
                actions.textContent = "—";
            }

            row.appendChild(actions);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        this.container.appendChild(tableWrapper);
    }
}
