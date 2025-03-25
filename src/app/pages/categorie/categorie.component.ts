import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { CategorieService } from '../../services/categorie/categorie.service';
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
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          this.loadScripts();
        }
      }
    });
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
        }
        this.isLoading = false;
        setTimeout(() => this.initDataTable(), 100);
      },
      error: (error: any) => {
        this.isLoading = false;
      }
    });
  }

  openNewModal(): void {
    this.isEditMode = false;
    this.selectedCategorie = null;
    this.buttonText = 'Enregistrer';
    this.icon = 'fa fa-save';
    this.categorieForm.reset();
    this.isSubmitted = false;
  }

  openModal(categorie?: Categorie): void {
    this.isEditMode = !!categorie;
    this.selectedCategorie = categorie || null;
    this.buttonText = this.isEditMode ? 'Modifier' : 'Enregistrer';
    this.icon = this.isEditMode ? 'fa fa-pencil-alt' : 'fa fa-save';

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

  saveOrUpdateCategorie(): void {
    this.isSubmitted = true;

    // arrêter ici si le formulaire est invalide
    if (this.categorieForm.invalid) {
      return;
    }

    // Créer l'objet catégorie
    const categorie = {
      nom: this.categorieForm.get('nom')?.value,
      description: this.categorieForm.get('description')?.value
    };

    let request;
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
          const modal = document.getElementById('modal-fadein');
          if (modal) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
              modalInstance.hide();
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
        console.log(error);
      }
    });
  }

  initDataTable(): void {
    if (isPlatformBrowser(this.platformId)) {
      const $ = (window as any).$;
      if ($ && $.fn.dataTable) {
        $('.js-dataTable-buttons').DataTable({
          responsive: true,
          language: {
            search: 'Rechercher',
            lengthMenu: 'Afficher _MENU_ entrées',
            info: 'Affichage de _START_ à _END_ sur _TOTAL_ entrées'
          }
        });
      }
    }
  }

  loadScripts() {
    const dynamicScripts = [
      "/js/lib/jquery.min.js",
      "/js/plugins/datatables/dataTables.min.js",
      "/js/plugins/datatables-bs5/js/dataTables.bootstrap5.min.js",
      "/js/plugins/datatables-responsive/js/dataTables.responsive.min.js",
      "/js/plugins/datatables-responsive-bs5/js/responsive.bootstrap5.min.js",
      "/js/plugins/datatables-buttons/dataTables.buttons.min.js",
      "/js/plugins/datatables-buttons-bs5/js/buttons.bootstrap5.min.js",
      "/js/plugins/datatables-buttons-jszip/jszip.min.js",
      "/js/plugins/datatables-buttons-pdfmake/pdfmake.min.js",
      "/js/plugins/datatables-buttons-pdfmake/vfs_fonts.js",
      "/js/plugins/datatables-buttons/buttons.print.min.js",
      "/js/plugins/datatables-buttons/buttons.html5.min.js",
      "/js/pages/be_tables_datatables.min.js",
      "/js/plugins/bootstrap-notify/bootstrap-notify.min.js"
    ];
    
    dynamicScripts.forEach(script => {
      const node = document.createElement('script');
      node.src = script;
      node.type = 'text/javascript';
      node.async = false;
      document.body.appendChild(node);
    });
  }
}
