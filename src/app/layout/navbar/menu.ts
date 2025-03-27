export const menu: any[] = [
    {
        nom: "Tableau de bord",
        lien: "/dashboard",
        icon:"fa fa-house-user"
    },
    {
        nom: "Gestion des Produits",
        icon:"fa fa-layer-group",
        sousmenu: [
            {
                nom: "Catégories",
                lien: "/gestion-des-produits/categorie"
            },
            {
                nom: "Fournisseurs",
                lien: "/gestion-des-produits/fournisseurs"
            },{
                nom: "Produits",
                lien: "/gestion-des-produits/produit"
            }
        ]
    },
    {
        nom: "Gestion des Achats",
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
    },
    {
        nom: "Utilisateurs",
        lien: "/dashboard",
        icon:"fa fa-user-cog",
    },
    {
        nom: "Configuration",
        lien: "/dashboard",
        icon:"fa fa-cog",
    }
];