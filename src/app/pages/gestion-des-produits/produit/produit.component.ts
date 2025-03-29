import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ProduitService } from '../../../services/gestion-des-produits/produit/produit.service';
import { CategorieService } from '../../../services/gestion-des-produits/categorie/categorie.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// interface Produit {
//   id: number;
//   nom: string;
//   prix_achat: number;
//   prix_vente: number;
//   stock_initial: number;
//   image: string | null;
//   categorie: {
//     id: number;
//     nom: string;
//   };
//   created_at: string;
//   updated_at: string;
//   deleted_at: string | null;
// }

// interface Categorie {
//   id: number;
//   nom: string;
// }

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produit.component.html',
  styleUrl: './produit.component.css'
})
export default class ProduitComponent implements OnInit {
  produits: any[] = [];
  categories: any[] = [];
  isLoading: boolean = false;
  produitForm: FormGroup;
  isSubmitted: boolean = false;
  isEditMode: boolean = false;
  selectedProduit: any | null = null;
  titleModal: string = 'AJOUTER UN PRODUIT';
  buttonText: string = 'Enregistrer';
  icon: string = 'fa fa-save';
  selectedImage: string | null = null;
  currentImage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.produitForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      prix_achat: ['', [Validators.required, Validators.min(0)]],
      prix_vente: ['', [Validators.required, Validators.min(0)]],
      stock_initial: ['', [Validators.required, Validators.min(0)]],
      categorie: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProduits();
    this.loadCategories();
  }

  // getter pour un accès facile aux champs du formulaire
  get f() { return this.produitForm.controls; }

  loadProduits(): void {
    this.isLoading = true;
    this.produitService.getAllProduits().subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data) {
          this.produits = response.data;
          // Attendre que le DOM soit mis à jour
          setTimeout(() => {
            if (isPlatformBrowser(this.platformId)) {
              const $ = (window as any).$;
              if ($ && $.fn.dataTable) {
                try {
                  // Détruire l'instance existante si elle existe
                  const existingTable = $('.js-dataTable-buttons').DataTable();
                  if (existingTable) {
                    existingTable.destroy();
                  }
                  
                  // Initialiser une nouvelle instance
                  $('.js-dataTable-buttons').DataTable({
                    language: {
                      emptyTable: "Aucune donnée",
                      info: "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
                      infoEmpty: "Affichage de 0 à 0 sur 0 entrée",
                      infoFiltered: "(filtré de _MAX_ entrées au total)",
                      infoThousands: ",",
                      lengthMenu: "Afficher _MENU_ entrées",
                      loadingRecords: "Chargement...",
                      processing: "Traitement...",
                      search: "Rechercher :",
                      zeroRecords: "Aucun enregistrement trouvé",
                      paginate: {
                        first: '<i class="fa fa-angle-double-left"></i>',
                        previous: '<i class="fa fa-chevron-left"></i>',
                        next: '<i class="fa fa-chevron-right"></i>',
                        last: '<i class="fa fa-angle-double-right"></i>'
                      }
                    },
                    dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
                         '<"row"<"col-sm-12"tr>>' +
                         '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                    pageLength: 5,
                    searching: true,
                    info: true,
                    lengthChange: true,
                    responsive: true,
                    pagingType: 'full_numbers'
                  });
                } catch (error) {
                  console.error('Erreur lors de l\'initialisation de DataTable:', error);
                }
              }
            }
          }, 100);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categorieService.getAllCategories().subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data) {
          this.categories = response.data;
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  openNewModal(): void {
    this.isEditMode = false;
    this.selectedProduit = null;
    const title = 'Ajouter un produit';
    this.titleModal = title.toUpperCase();
    this.buttonText = 'Enregistrer';
    this.icon = 'fa fa-save';
    this.produitForm.reset();
    this.isSubmitted = false;
    this.selectedImage = null;
    this.currentImage = null;
    this.selectedFile = null;
  }

  openEditProduit(produit: any): void {
    this.isEditMode = true;
    this.selectedProduit = produit;
    this.buttonText = 'Modifier';
    this.icon = 'fa fa-pencil-alt';
    const title = `Modifier le produit [${produit.nom}]`;
    this.titleModal = title.toUpperCase();

    // Remplir le formulaire avec les données du produit
    this.produitForm.patchValue({
      nom: produit.nom,
      prix_achat: produit.prix_achat,
      prix_vente: produit.prix_vente,
      stock_initial: produit.stock_initial,
      categorie: produit.categorie.id
    });

    this.currentImage = produit.image;
    this.selectedImage = null;
    this.selectedFile = null;
    this.isSubmitted = false;
  }

  openViewProduit(produit: any): void {
    this.selectedProduit = produit;
    const title = 'Visualiser un produit';
    this.titleModal = title.toUpperCase();
    this.buttonText = 'Fermer';
    this.icon = 'fa fa-times';
    this.produitForm.reset();
    this.isSubmitted = false;
    this.currentImage = produit.image;
    this.selectedImage = null;
    this.selectedFile = null;

    // Remplir le formulaire en lecture seule
    this.produitForm.patchValue({
      nom: produit.nom,
      prix_achat: produit.prix_achat,
      prix_vente: produit.prix_vente,
      stock_initial: produit.stock_initial,
      categorie: produit.categorie.id
    });

    // Désactiver les champs du formulaire
    Object.keys(this.produitForm.controls).forEach(key => {
      this.produitForm.get(key)?.disable();
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveOrUpdateProduit(): void {
    this.isSubmitted = true;

    if (this.produitForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.produitForm.get('nom')?.value);
    formData.append('prix_achat', this.produitForm.get('prix_achat')?.value);
    formData.append('prix_vente', this.produitForm.get('prix_vente')?.value);
    formData.append('stock_initial', this.produitForm.get('stock_initial')?.value);
    formData.append('categorie', this.produitForm.get('categorie')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    let request;
    if (this.isEditMode && this.selectedProduit) {
      request = this.produitService.updateProduit(this.selectedProduit.id, formData);
    } else {
      request = this.produitService.saveProduit(formData);
    }

    request.subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          // Fermer le modal
          const modal = document.getElementById('modal-fadein');
          if (modal) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
              modalInstance.hide();
            }
          }

          // Afficher la notification
          if (isPlatformBrowser(this.platformId)) {
            const $ = (window as any).$;
            if ($) {
              $.notify({
                icon: 'fa fa-check me-1',
                message: this.isEditMode ? 
                  'Le produit a été modifié avec succès' : 
                  'Le produit a été ajouté avec succès'
              }, {
                type: 'success',
                placement: {
                  from: 'top',
                  align: 'right'
                },
                delay: 3000,
                z_index: 9999,
                animate: {
                  enter: 'animated fadeInDown',
                  exit: 'animated fadeOutUp'
                }
              });
            }
          }

          // Recharger la liste des produits
          this.loadProduits();

          // Réinitialiser le formulaire et les états
          this.produitForm.reset();
          this.isSubmitted = false;
          this.isEditMode = false;
          this.selectedProduit = null;
          this.selectedImage = null;
          this.currentImage = null;
          this.selectedFile = null;
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de la sauvegarde:', error);
        
        // Afficher une notification d'erreur
        if (isPlatformBrowser(this.platformId)) {
          const $ = (window as any).$;
          if ($) {
            $.notify({
              icon: 'fa fa-times me-1',
              message: 'Une erreur est survenue lors de la sauvegarde'
            }, {
              type: 'danger',
              placement: {
                from: 'top',
                align: 'right'
              },
              delay: 3000,
              z_index: 9999,
              animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
              }
            });
          }
        }
      }
    });
  }

  deleteProduit(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(id).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            // Afficher la notification
            if (isPlatformBrowser(this.platformId)) {
              const $ = (window as any).$;
              if ($) {
                $.notify({
                  icon: 'fa fa-check me-1',
                  message: 'Le produit a été supprimé avec succès'
                }, {
                  type: 'success',
                  placement: {
                    from: 'top',
                    align: 'right'
                  },
                  delay: 3000,
                  z_index: 9999,
                  animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                  }
                });
              }
            }

            // Recharger la liste des produits
            this.loadProduits();
          }
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
          
          // Afficher une notification d'erreur
          if (isPlatformBrowser(this.platformId)) {
            const $ = (window as any).$;
            if ($) {
              $.notify({
                icon: 'fa fa-times me-1',
                message: 'Une erreur est survenue lors de la suppression'
              }, {
                type: 'danger',
                placement: {
                  from: 'top',
                  align: 'right'
                },
                delay: 3000,
                z_index: 9999,
                animate: {
                  enter: 'animated fadeInDown',
                  exit: 'animated fadeOutUp'
                }
              });
            }
          }
        }
      });
    }
  }
}
