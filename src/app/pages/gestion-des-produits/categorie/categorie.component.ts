import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { CategorieService } from '../../../services/gestion-des-produits/categorie/categorie.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


interface Categorie {
  id: number;
  nom: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.css'
})
export default class CategorieComponent implements OnInit {
  categories: Categorie[] = [];
  isLoading: boolean = false;
  categorieForm: FormGroup;
  isSubmitted: boolean = false;
  isEditMode: boolean = false;
  selectedCategorie: Categorie | null = null;
  titleModal: string = 'AJOUTER UNE CATEGORIE';
  buttonText: string = 'Enregistrer';
  icon: string = 'fa fa-save';

  constructor(
    private router: Router,
    private categorieService: CategorieService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.categorieForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     if (isPlatformBrowser(this.platformId)) {
    //       this.loadScripts();
    //     }
    //   }
    // });
    this.loadCategories();
  }

  // getter pour un accès facile aux champs du formulaire
  get f() { return this.categorieForm.controls; }

  loadCategories(): void {
    this.isLoading = true;
    this.categorieService.getAllCategories().subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data) {
          this.categories = response.data;
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
        console.error('Erreur lors du chargement des catégories:', error);
        this.isLoading = false;
      }
    });
  }

  openNewModal(): void {
    this.isEditMode = false;
    this.selectedCategorie = null;
    const title = 'Ajouter une catégorie';
    this.titleModal = title.toUpperCase();
    this.buttonText = 'Enregistrer';
    this.icon = 'fa fa-save';
    this.categorieForm.reset();
    this.isSubmitted = false;
  }

  openEditCategorie(categorie?: Categorie): void {
    this.isEditMode = !!categorie;
    this.selectedCategorie = categorie || null;
    this.buttonText = this.isEditMode ? 'Modifier' : 'Enregistrer';
    this.icon = this.isEditMode ? 'fa fa-pencil-alt' : 'fa fa-save';
    const title = `Modifier la catégorie [${categorie?.nom}]`;
    const defaultTitle = 'Ajouter une catégorie';
    this.titleModal = this.isEditMode ? title.toUpperCase() : defaultTitle.toUpperCase();

    // Désactiver les champs du formulaire
    this.categorieForm.get('nom')?.enable();
    this.categorieForm.get('description')?.enable();

    if (this.isEditMode && categorie) {
      // Remplir le formulaire avec les données de la catégorie
      this.categorieForm.patchValue({
        nom: categorie.nom,
        description: categorie.description || ''
      });
    } else {
      // Réinitialiser le formulaire pour une nouvelle catégorie
      this.categorieForm.reset();
    }

    this.isSubmitted = false;

    // Ouvrir le modal
    const modal = document.getElementById('modal-fadein');
    if (modal) {
      const modalInstance = new (window as any).bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  openViewCategorie(categorie: Categorie): void {
    this.selectedCategorie = categorie;
    const title = 'Visualiser une catégorie';
    this.titleModal = title.toUpperCase();
    this.buttonText = 'Fermer';
    this.icon = 'fa fa-times';
    this.categorieForm.reset();
    this.isSubmitted = false;

    // Remplir le formulaire en lecture seule
    this.categorieForm.patchValue({
      nom: categorie.nom,
      description: categorie.description || ''
    });

    // Désactiver les champs du formulaire
    this.categorieForm.get('nom')?.disable();
    this.categorieForm.get('description')?.disable();

    const modal = document.getElementById('modal-fadein');
    if (modal) {
      const modalInstance = new (window as any).bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  saveOrUpdateCategorie(): void {
    this.isSubmitted = true;

    // arrêter ici si le formulaire est invalide
    if (this.categorieForm.invalid) {
      return;
    }

    let request;
    const categorie = this.categorieForm.value;
    if (this.isEditMode && this.selectedCategorie) {
      // Mode modification
      request = this.categorieService.updateCategorie(this.selectedCategorie.id, categorie);
    } else {
      // Mode création
      request = this.categorieService.createCategorie(categorie);
    }

    request.subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          // Fermer le modal
          if (this.isEditMode) {
            const modal = document.getElementById('modal-fadein');
            if (modal) {
              const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
              if (modalInstance) {
                modalInstance.hide();
              }
            }
          }

          // Afficher la notification
          if (isPlatformBrowser(this.platformId)) {
            const $ = (window as any).$;
            if ($) {
              $.notify({
                icon: 'fa fa-check me-1',
                message: this.isEditMode ? 
                  'La catégorie a été modifiée avec succès' : 
                  'La catégorie a été ajoutée avec succès'
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

          // Recharger la liste des catégories
          this.loadCategories();

          // Réinitialiser le formulaire et les états
          this.categorieForm.reset();
          this.isSubmitted = false;
          this.isEditMode = false;
          this.selectedCategorie = null;
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

  // loadScripts() {
  //   console.log('Début du chargement des scripts...');
  //   const dynamicScripts = [
  //     "/js/lib/jquery.min.js",
  //     "/js/plugins/datatables/jquery.dataTables.min.js",
  //     "/js/plugins/datatables-bs5/js/dataTables.bootstrap5.min.js",
  //     "/js/plugins/datatables-responsive/js/dataTables.responsive.min.js",
  //     "/js/plugins/datatables-responsive-bs5/js/responsive.bootstrap5.min.js",
  //     "/js/plugins/datatables-buttons/dataTables.buttons.min.js",
  //     "/js/plugins/datatables-buttons-bs5/js/buttons.bootstrap5.min.js",
  //     "/js/plugins/datatables-buttons-jszip/jszip.min.js",
  //     "/js/plugins/datatables-buttons-pdfmake/pdfmake.min.js",
  //     "/js/plugins/datatables-buttons-pdfmake/vfs_fonts.js",
  //     "/js/plugins/datatables-buttons/buttons.print.min.js",
  //     "/js/plugins/datatables-buttons/buttons.html5.min.js"
  //   ];
    
  //   let loadedScripts = 0;
    
  //   const loadScript = (script: string): Promise<void> => {
  //     return new Promise((resolve, reject) => {
  //       console.log(`Chargement du script: ${script}`);
  //       const node = document.createElement('script');
  //       node.src = script;
  //       node.type = 'text/javascript';
  //       node.async = false;
  //       node.onload = () => {
  //         loadedScripts++;
  //         console.log(`Script chargé avec succès: ${script}`);
  //         if (loadedScripts === dynamicScripts.length) {
  //           console.log('Tous les scripts sont chargés, initialisation de DataTable...');
  //           setTimeout(() => this.initDataTable(), 100);
  //         }
  //         resolve();
  //       };
  //       node.onerror = (error) => {
  //         console.error(`Erreur lors du chargement du script ${script}:`, error);
  //         reject(error);
  //       };
  //       document.body.appendChild(node);
  //     });
  //   };

  //   dynamicScripts.reduce((promise, script) => {
  //     return promise.then(() => loadScript(script));
  //   }, Promise.resolve());
  // }

  // initDataTable(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     console.log('Initialisation de DataTable...');
  //     const $ = (window as any).$;
  //     console.log('jQuery disponible:', !!$);
  //     console.log('DataTable disponible:', !!($ && $.fn.dataTable));
      
  //     if ($ && $.fn.dataTable) {
  //       try {
  //         const table = $('.js-dataTable-buttons').DataTable({
  //           language: {
  //             emptyTable: "Aucune donnée disponible dans le tableau",
  //             info: "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
  //             infoEmpty: "Affichage de 0 à 0 sur 0 entrée",
  //             infoFiltered: "(filtré de _MAX_ entrées au total)",
  //             infoThousands: ",",
  //             lengthMenu: "Afficher _MENU_ entrées",
  //             loadingRecords: "Chargement...",
  //             processing: "Traitement...",
  //             search: "Rechercher :",
  //             zeroRecords: "Aucun enregistrement trouvé",
  //             paginate: {
  //               first: '<i class="fa fa-angle-double-left"></i>',
  //               previous: '<i class="fa fa-chevron-left"></i>',
  //               next: '<i class="fa fa-chevron-right"></i>',
  //               last: '<i class="fa fa-angle-double-right"></i>'
  //             }
  //           },
  //           dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
  //                '<"row"<"col-sm-12"tr>>' +
  //                '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
  //           pageLength: 5,
  //           searching: true,
  //           info: true,
  //           lengthChange: true,
  //           responsive: true,
  //           pagingType: 'full_numbers'
  //         });
  //         console.log('DataTable initialisé avec succès');
  //       } catch (error) {
  //         console.error('Erreur lors de l\'initialisation de DataTable:', error);
  //       }
  //     }
  //   }
  // }
}
