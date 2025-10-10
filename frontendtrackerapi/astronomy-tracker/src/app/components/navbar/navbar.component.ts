import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../models/astronomy.models';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  showSearch = false;
  searchQuery = '';
  currentUser: UserDto | null = null;
  showUserMenu = false;
  showProfileModal = false;
  imageLoadError = false;
  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  changePasswordForm: FormGroup;
  passwordChangeError = '';
  passwordChangeSuccess = '';
  isChangingPassword = false;
  private userSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador para verificar se as senhas coincidem
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.imageLoadError = false; // Reset error when user changes
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  openProfileModal(): void {
    this.showUserMenu = false; // Fechar o menu dropdown
    this.showProfileModal = true;
    this.resetPasswordForm(); // Reset form when opening modal
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  // Método para abrir o seletor de arquivo
  openFileSelector(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];

        // Validação do tipo de arquivo
        if (!file.type.match('image.*')) {
          alert('Por favor, selecione uma imagem.');
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.updateProfilePicture(reader.result as string);
        };
      }
    });

    fileInput.click();
  }

  // Método para atualizar a foto de perfil
  updateProfilePicture(base64Image: string): void {
    this.authService.updateProfilePicture(base64Image).subscribe({
      next: () => {
        this.imageLoadError = false;
      },
      error: (error) => {
        console.error('Erro ao atualizar foto de perfil:', error);
      }
    });
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }

  closeSearch(): void {
    this.showSearch = false;
    this.searchQuery = '';
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/gallery'], {
        queryParams: { search: this.searchQuery.trim() }
      });
      this.closeSearch();
    }
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Password visibility toggle methods
  toggleOldPasswordVisibility(): void {
    this.hideOldPassword = !this.hideOldPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  // Reset form and error messages
  resetPasswordForm(): void {
    this.changePasswordForm.reset();
    this.passwordChangeError = '';
    this.passwordChangeSuccess = '';
    this.hideOldPassword = true;
    this.hideNewPassword = true;
    this.hideConfirmPassword = true;
  }

  // Submit password change form
  onChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.passwordChangeError = '';
    this.passwordChangeSuccess = '';
    this.isChangingPassword = true;

    const formValues = this.changePasswordForm.value;

    this.authService.changePassword(formValues.oldPassword, formValues.newPassword)
      .subscribe({
        next: () => {
          this.passwordChangeSuccess = 'Password successfully changed';
          this.changePasswordForm.reset();
          this.isChangingPassword = false;
        },
        error: (error) => {
          this.passwordChangeError = error?.error?.message || 'Failed to change password';
          this.isChangingPassword = false;
        }
      });
  }
}
