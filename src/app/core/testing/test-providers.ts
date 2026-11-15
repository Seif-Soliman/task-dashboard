// import '@angular/compiler';

// import { provideZonelessChangeDetection } from '@angular/core';
// import { getTestBed, TestBed, type TestModuleMetadata } from '@angular/core/testing';
// import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
// import { provideTranslateService } from '@ngx-translate/core';

// // Initialize Angular testing environment once.
// getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

// // Global providers shared across all specs.
// const GLOBAL_PROVIDERS: NonNullable<TestModuleMetadata['providers']> = [
//   provideZonelessChangeDetection(),

//   provideTranslateService({
//     lang: 'en',
//     fallbackLang: 'en',
//   }),
// ];

// // Preserve the original implementation.
// const originalConfigureTestingModule = TestBed.configureTestingModule.bind(TestBed);

// // Intercept configureTestingModule.
// TestBed.configureTestingModule = ((moduleDef: TestModuleMetadata) => {
//   return originalConfigureTestingModule({
//     ...moduleDef,
//     providers: [...GLOBAL_PROVIDERS, ...(moduleDef.providers ?? [])],
//   });
// }) as typeof TestBed.configureTestingModule;

import { provideZonelessChangeDetection } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';

export default [
  provideZonelessChangeDetection(),

  provideTranslateService({
    lang: 'en',
    fallbackLang: 'en',
  }),
];
