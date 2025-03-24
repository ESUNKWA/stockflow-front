import { Component } from '@angular/core';
import { NavbarComponent } from "../layout/navbar/navbar.component";
import { HeaderComponent } from "../layout/header/header.component";
import { FooterComponent } from "../layout/footer/footer.component";
import { AsideComponent } from "../layout/aside/aside.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default',
  imports: [RouterOutlet, NavbarComponent, HeaderComponent, FooterComponent, AsideComponent],
  templateUrl: './default.component.html',
  styleUrl: './default.component.css'
})
export default class DefaultComponent {

}
