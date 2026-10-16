# Angular Custom Input Feature Sample

Angular 20 and TypeScript sample demonstrating a standalone Material input component and Angular forms integration.

## Purpose

I created the **bluebilling-shared-stuff Angular library** to reuse this custom input component across **five different portals: Move In, Move Out, Connection, Make Payment, and Customer Portal**. Sharing the component through the library centralizes input behavior and presentation, reduces duplicated code, and lets fixes be maintained in one place.

This sample modernizes the library input for Angular 20 while keeping validation and business behavior in the consuming form. The example template uses fictional billing fields.

## Custom Input Component

**Sources:** [bb-input.component.ts](./features/bb-input.component.ts), [bb-input.component.html](./features/bb-input.component.html)

- Uses a standalone component, signal inputs, typed outputs, signal state, and OnPush change detection.
- Implements ControlValueAccessor and registers with the optional, self-scoped NgControl.
- Propagates string values on input and marks the control touched on blur.
- Implements disabled state and preserves numeric zero when writing a value.
- Displays the first validation error using consumer-supplied messages and a Material error-state matcher.
- Supports labels, IDs, names, autocomplete, input mode, length, currency prefixes, warning hints, and projected suffix content.
- Uses Angular's built-in @if control flow.
- Observes form events with automatic subscription cleanup so parent-driven validation and reset refresh the OnPush view.

**What this demonstrates:** encapsulating form presentation and value-accessor behavior in one component.

## Example Template

**Source:** [bb-input-example.html](./features/bb-input-example.html)

Demonstrates email validation, an amount warning and currency prefix, password visibility through a projected button, marking controls touched, and toggling disabled state.

**What this demonstrates:** composing the custom control while keeping validators and form state in the consuming feature.

## Technologies

Angular 20 standalone components, signal inputs, outputs, signals, dependency injection, OnPush change detection, reactive forms, ControlValueAccessor, and Angular Material.

## Excerpt Context and Behavior Boundaries

This is a modernized adaptation of the library's bb-input component, not an exact copy or an update to the production library. The folder contains only the component, its template, and a consumer example template. There is no supporting module, directive, pipe, or example component class.

These files are outside the application's normal build configuration. The consuming Angular 20 application needs matching Angular Material and CDK packages, a Material theme, and animation setup appropriate to its host application. Import BbInputComponent and ReactiveFormsModule into the host component.

The example template expects these host properties:

```ts
readonly form = new FormGroup({
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  }),
  amount: new FormControl('', {
    nonNullable: true,
    validators: [Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)],
  }),
  password: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8)],
  }),
});
showPassword = false;
```

Import FormControl, FormGroup, and Validators from @angular/forms. Render the example template within that host. No bootstrap, route, or persistence is included. No SCSS is included; supply .mat-form-field-default { width: 100%; } and any warning styling in the host.

Input restrictions and their flags are removed with the directive. Values are not sanitized; patterns, maximum length, and input mode configure the native input, while Angular validators enforce form validity. International text and password characters are retained. The inputID is required. Values are emitted as strings; onInput emits the new value. Deprecated keypress forwarding, imperative type mutation, and unused disabled inputs are removed. Bind type for password visibility and use the form control to manage disabled state.

Error messages appear after blur or an explicit markAllAsTouched(). A fallback message is used when the first error has no mapping. Warning hints can appear alongside validation errors. Without a forms directive the component can render, but has no external value or validation binding.

The component and example template passed strict Angular 20 template and TypeScript compilation with Angular Material 20, using a temporary consumer host. No files were emitted. Browser interaction has not been tested.

## Portfolio Message

I created an Angular library to share reusable UI components across five billing portals. This custom input demonstrates that approach: common form behavior is maintained in the library, while each portal owns its validation rules and business logic. The portfolio sample also demonstrates how I modernize that component with Angular 20 standalone components, signals, typed events, and content projection.

