export const menu: any[] = [
    {
        nom: "Tableau de bord",
        lien: "/dashboard",
        icon:"fa fa-house-user"
    },
    {
        nom: "Gestion des Produits",
        lien: "/dashboard",
        icon:"fa fa-layer-group",
        sousmenu: [
            {
                nom: "Catégories",
                lien: "/dashboard",
                icon:"fa fa-house-user"
            },
            {
                nom: "Fournisseurs",
                lien: "/dashboard",
                icon:"fa fa-house-user"
            },{
                nom: "Produits",
                lien: "/dashboard",
                icon:"fa fa-house-user"
            }
        ]
    },
    {
        nom: "Gestion des Achats",
        lien: "",
        icon:"fa fa-cart-shopping",
        sousmenu: [
            {
                nom: "Achats",
                lien: "/dashboard"
            },
            {
                nom: "Historique des Achats",
                lien: "/dashboard"
            }
        ]
    },
    {
        nom: "Gestion des Ventes",
        lien: "/",
        icon:"fa fa-money-check-dollar",
        sousmenu: [
            {
                nom: "Ventes",
                lien: "/dashboard",
            },
            {
                nom: "Clients",
                lien: "/dashboard"
            },
            {
                nom: "Historique des ventes",
                lien: "/dashboard"
            }
        ]
    },
    {
        nom: "Gestion du Stock",
        lien: "/",
        icon:"fa fa-chart-pie",
        sousmenu: [
            {
                nom: "Ventes",
                lien: "/dashboard",
            },
            {
                nom: "Clients",
                lien: "/dashboard"
            },
            {
                nom: "Historique des ventes",
                lien: "/dashboard"
            }
        ]
    }
];