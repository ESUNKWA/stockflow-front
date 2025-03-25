import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          this.loadScripts();
        }
      }
    });
  }
  loadScripts() {
    const dynamicScripts = [
      "/js/plugins/chart.js/chart.umd.js",
      "/js/pages/be_pages_dashboard.min.js"
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
