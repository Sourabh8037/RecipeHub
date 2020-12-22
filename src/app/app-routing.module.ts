import { NgModule } from "@angular/core";
import {Routes,RouterModule, PreloadAllModules} from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGaurd } from './auth/auth.gaurd';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeResolverService } from './recipes/recipes-resolver.service';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
const appRoutes : Routes =[
{
  path:"shopping-list",
  component:ShoppingListComponent
},
{
  path:'recipes',
  loadChildren:()=>import('./recipes/recipes.module').then(m=>m.RecipesModule),
},
{
  path:'auth',
  component:AuthComponent
},
{
  path:'**',
  redirectTo:'/recipes',
  pathMatch:'full'
},
];

@NgModule({
  imports:[RouterModule.forRoot(appRoutes,{
    preloadingStrategy:PreloadAllModules
  })],
  exports:[RouterModule]
})

export class AppRoutingModule{};