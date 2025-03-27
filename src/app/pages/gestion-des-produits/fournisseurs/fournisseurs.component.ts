import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FournisseurService } from '../../../services/gestion-des-produits/fournisseur/fournisseur.service';


@Component({
  selector: 'app-fournisseurs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fournisseurs.component.html',
  styleUrl: './fournisseurs.component.css'
})
export default class FournisseursComponent implements OnInit {
  // Propriétés pour gérer les fournisseurs
  fournisseurs: any[] = [];
  isLoading = false;
  
  // Propriétés pour le formulaire
  fournisseurForm!: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentFournisseurId: number | null = null;
  
  // Propriétés pour le modal
  titleModal = 'NOUVEAU FOURNISSEUR';
  buttonText = 'Enregistrer';
  icon = 'fa fa-save';

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadFournisseurs();
  }

  // Initialise le formulaire
  initForm(): void {
    this.fournisseurForm = this.fb.group({
      nom: ['', [Validators.required]],
      addresse_geo: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      interlocuteur: ['', [Validators.required]],
      contact_interlocuteur: ['', [Validators.required]]
    });
  }

  // Getter pour les contrôles du formulaire
  get f() {
    return this.fournisseurForm.controls;
  }

  // Charge la liste des fournisseurs
  loadFournisseurs(): void {
    this.isLoading = true;
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.fournisseurs = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          // Si les données sont encapsulées dans un objet avec une propriété 'data'
          this.fournisseurs = data.data;
        } else {
          // En cas de structure inattendue, initialiser avec un tableau vide
          console.error('Format de données inattendu:', data);
          this.fournisseurs = [];
        }
        this.isLoading = false;
        
        // Initialiser DataTable après chargement des données
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
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fournisseurs', error);
        this.isLoading = false;
      }
    });
  }

  // Ouvre le modal pour ajouter un nouveau fournisseur
  openNewModal(): void {
    this.editMode = false;
    this.currentFournisseurId = null;
    this.titleModal = 'NOUVEAU FOURNISSEUR';
    this.buttonText = 'Enregistrer';
    this.icon = 'fa fa-save';
    this.fournisseurForm.reset();
    this.fournisseurForm.enable();
    this.isSubmitted = false;
  }

  // Ouvre le modal pour visualiser un fournisseur
  openViewFournisseur(fournisseur: any): void {
    this.titleModal = 'VISUALISER FOURNISSEUR';
    this.icon = 'fa fa-eye';
    this.buttonText = '';
    this.fillFormWithFournisseur(fournisseur);
    this.fournisseurForm.disable();

    // Ouvrir manuellement le modal si nécessaire
    const modalElement = document.getElementById('modal-fadein');
    if (modalElement) {
      const modalInstance = new (window as any).bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  // Ouvre le modal pour modifier un fournisseur
  openEditFournisseur(fournisseur: any): void {
    this.editMode = true;
    this.currentFournisseurId = fournisseur.id;
    this.titleModal = 'MODIFIER FOURNISSEUR';
    this.buttonText = 'Mettre à jour';
    this.icon = 'fa fa-edit';
    this.fillFormWithFournisseur(fournisseur);
    this.fournisseurForm.enable();

    // Ouvrir manuellement le modal si nécessaire
    const modalElement = document.getElementById('modal-fadein');
    if (modalElement) {
      const modalInstance = new (window as any).bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  // Remplit le formulaire avec les données du fournisseur
  fillFormWithFournisseur(fournisseur: any): void {
    this.fournisseurForm.patchValue({
      nom: fournisseur.nom,
      addresse_geo: fournisseur.addresse_geo,
      contact: fournisseur.contact,
      email: fournisseur.email,
      interlocuteur: fournisseur.interlocuteur,
      contact_interlocuteur: fournisseur.contact_interlocuteur
    });
  }

  // Enregistre ou met à jour un fournisseur
  saveOrUpdateFournisseur(): void {
    this.isSubmitted = true;

    if (this.fournisseurForm.invalid) {
      return;
    }

    const fournisseurData = this.fournisseurForm.value;
    
    if (this.editMode && this.currentFournisseurId) {
      // Mise à jour
      this.fournisseurService.updateFournisseur(this.currentFournisseurId, fournisseurData).subscribe({
        next: (response: any) => {
          // Ne pas fermer le modal automatiquement
          // Réinitialisation du formulaire après la mise à jour
          this.isSubmitted = false;

          // Afficher la notification
          if (isPlatformBrowser(this.platformId)) {
            const $ = (window as any).$;
            if ($) {
              $.notify({
                icon: 'fa fa-check me-1',
                message: 'Le fournisseur a été modifié avec succès'
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
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du fournisseur', error);
          // Afficher une notification d'erreur
          if (isPlatformBrowser(this.platformId)) {
            const $ = (window as any).$;
            if ($) {
              $.notify({
                icon: 'fa fa-times me-1',
                message: 'Une erreur est survenue lors de la mise à jour'
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

      this.loadFournisseurs();
    } else {
      // Création
      this.fournisseurService.saveFournisseur(fournisseurData).subscribe({
        next: (response: any) => {
          // Ne pas fermer le modal automatiquement
          // Réinitialisation du formulaire après la création
          this.fournisseurForm.reset();
          this.isSubmitted = false;

          // Afficher la notification
          if (isPlatformBrowser(this.platformId)) {
            const $ = (window as any).$;
            if ($) {
              $.notify({
                icon: 'fa fa-check me-1',
                message: 'Le fournisseur a été ajouté avec succès'
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
        },
        error: (error) => {
          console.error('Erreur lors de la création du fournisseur', error);
          // Afficher une notification d'erreur
          if (isPlatformBrowser(this.platformId)) {
            const $ = (window as any).$;
            if ($) {
              $.notify({
                icon: 'fa fa-times me-1',
                message: 'Une erreur est survenue lors de la création'
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

      this.loadFournisseurs();
    }
  }

  // Supprime un fournisseur
  deleteFournisseur(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      this.fournisseurService.deleteFournisseur(id).subscribe({
        next: (response: any) => {          
          // Afficher la notification de succès
          if (isPlatformBrowser(this.platformId)) {
            const $ = (window as any).$;
            if ($) {
              $.notify({
                icon: 'fa fa-check me-1',
                message: 'Le fournisseur a été supprimé avec succès'
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
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du fournisseur', error);
          
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

      this.loadFournisseurs();
    }
  }
}
