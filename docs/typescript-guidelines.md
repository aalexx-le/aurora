# TypeScript Project Guidelines

## Rule 1: Consistent Type Declarations

**Description:** Use explicit type annotations for function parameters, return types, and variable declarations to improve code clarity and catch errors at compile time.

**Good Example:**

```typescript
function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}

const userName: string = "John";
```

**Bad Example:**

```typescript
function calculateArea(radius) {
  return Math.PI * radius * radius;
}

const userName = "John";
```

## Rule 2: Interface Over Type Alias

**Description:** Prefer interfaces over type aliases for object definitions as they are more extensible and better represent object structures.

**Good Example:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Can be extended
interface AdminUser extends User {
  permissions: string[];
}
```

**Bad Example:**

```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

// Less clear extension pattern
type AdminUser = User & {
  permissions: string[];
};
```

## Rule 3: Function Return Types

**Description:** Always specify return types for functions, especially for public APIs and complex functions.

**Good Example:**

```typescript
function fetchUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`).then(response => response.json());
}
```

**Bad Example:**

```typescript
function fetchUser(id: number) {
  return fetch(`/api/users/${id}`).then(response => response.json());
}
```

## Rule 4: Use Enums for Constants

**Description:** Define related constants using enums to improve type safety and code readability.

**Good Example:**

```typescript
enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

function checkAccess(role: UserRole): boolean {
  return role === UserRole.ADMIN;
}
```

**Bad Example:**

```typescript
const ADMIN = 'admin';
const EDITOR = 'editor';
const VIEWER = 'viewer';

function checkAccess(role: string): boolean {
  return role === 'admin';
}
```

## Rule 5: Null Checking

**Description:** Use strict null checking and proper handling of null and undefined values.

**Good Example:**

```typescript
function getUsername(user: User | null): string {
  if (!user) {
    return 'Guest';
  }
  return user.name;
}
```

**Bad Example:**

```typescript
function getUsername(user: User): string {
  return user.name; // Will throw error if user is null
}
```

## Rule 6: Avoid Any Type

**Description:** Minimize use of the `any` type to maintain type safety benefits. Use unknown instead when the type is truly unknown.

**Good Example:**

```typescript
function parseJSON(jsonString: string): unknown {
  return JSON.parse(jsonString);
}

const data = parseJSON('{"name": "John"}') as { name: string };
```

**Bad Example:**

```typescript
function parseJSON(jsonString: string): any {
  return JSON.parse(jsonString);
}

const data = parseJSON('{"name": "John"}');
const name = data.name; // No type safety
```

## Rule 7: Interface Naming Conventions

**Description:** Prefix interfaces with "I" to distinguish them from classes, especially when they have implementation counterparts.

**Good Example:**

```typescript
interface IShape {
  calculateArea(): number;
}

class Circle implements IShape {
  constructor(private radius: number) {}

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}
```

**Bad Example:**

```typescript
interface Shape {
  calculateArea(): number;
}

class Shape {
  calculateArea(): number {
    // Implementation
    return 0;
  }
}
```

## Rule 8: Use Type Guards

**Description:** Implement type guards for safer type narrowing in conditional blocks.

**Good Example:**

```typescript
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function isFish(pet: Bird | Fish): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Bird | Fish) {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows pet is Fish here
  } else {
    pet.fly(); // TypeScript knows pet is Bird here
  }
}
```

**Bad Example:**

```typescript
function move(pet: Bird | Fish) {
  if ((pet as Fish).swim) {
    (pet as Fish).swim(); // Type casting in multiple places
  } else {
    (pet as Bird).fly(); // Type casting again
  }
}
```

## Rule 9: Consistent Import Style

**Description:** Use a consistent approach for imports to improve code readability.

**Good Example:**

```typescript
// Group and sort imports
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
```

**Bad Example:**

```typescript
import { UserService } from '../../services/user.service';
import { Component } from '@angular/core';
import {User} from '../../models/user.model';
import {Observable} from 'rxjs';
```

## Rule 10: Use Readonly for Immutability

**Description:** Use the `readonly` modifier for properties that should not be modified after initialization.

**Good Example:**

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
// point.x = 5; // Error: Cannot assign to 'x' because it is a read-only property
```

**Bad Example:**

```typescript
interface Point {
  x: number;
  y: number;
}

const point: Point = { x: 10, y: 20 };
// Nothing prevents accidental modification
point.x = 5;
```

## Rule 11: Union and Intersection Types

**Description:** Use union (`|`) and intersection (`&`) types effectively to model complex type relationships.

**Good Example:**

```typescript
type NetworkLoadingState = {
  state: 'loading';
};

type NetworkFailedState = {
  state: 'failed';
  error: Error;
};

type NetworkSuccessState = {
  state: 'success';
  response: {
    data: unknown;
  };
};

type NetworkState = 
  | NetworkLoadingState 
  | NetworkFailedState 
  | NetworkSuccessState;

function handleState(state: NetworkState): void {
  switch (state.state) {
    case 'loading':
      // Handle loading state
      break;
    case 'failed':
      // Handle failed state with error
      console.error(state.error);
      break;
    case 'success':
      // Handle success state with response
      console.log(state.response.data);
      break;
  }
}
```

**Bad Example:**

```typescript
interface NetworkState {
  state: string;
  error?: Error;
  response?: {
    data: unknown;
  };
}

function handleState(state: NetworkState): void {
  if (state.state === 'loading') {
    // Handle loading
  } else if (state.state === 'failed') {
    // Error might be undefined
    console.error(state.error);
  } else if (state.state === 'success') {
    // Response might be undefined
    console.log(state.response.data);
  }
}
```

## Rule 12: Use ESLint for TypeScript

**Description:** Configure and use ESLint with typescript-specific plugins to enforce coding standards and catch common errors.

**Good Example:**

```typescript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error'
  }
};
```

**Bad Example:**

Not using linting tools or using only basic configuration without TypeScript-specific rules.
