import { Injectable } from '@angular/core';
import { themeQuartz } from 'ag-grid-community';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  myDarkTheme = themeQuartz.withParams({
    accentColor: '#00A2FF',
    backgroundColor: '#21222C',
    cellTextColor: '#50F178',
    headerTextColor: '#68FF8E',
  });

  myLightTheme = themeQuartz.withParams({
    accentColor: '#0077CC',
    backgroundColor: '#FFFFFF',
    cellTextColor: '#000000',
    headerTextColor: '#333333',
  });

  getBrowserTheme(): 'dark' | 'light' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  applyTheme(): { theme: any; themeClass: string } {
    const isDark = this.getBrowserTheme() === 'dark';
    const theme = isDark ? this.myDarkTheme : this.myLightTheme;
    const themeClass = isDark ? 'ag-theme-quartz-dark' : 'ag-theme-quartz';

    const style = (theme as any).style;
    if (style && style.variables) {
      const vars = style.variables;
      Object.entries(vars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--ag-${key}`, value as string);
      });
    }

    return { theme, themeClass };
  }

  watchThemeChange(callback: () => void) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      callback();
    });
  }
}
