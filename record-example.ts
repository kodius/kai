type Role = "admin" | "user" | "snake"

// good example

type Setup = {
  a: string
  b: string
  c: string
}

const record: Record<Role, Setup> = {
  admin: {
    a: "a",
    b: "b",
    c: "c"
  },
  user: {
    a: "a",
    b: "b",
    c: "c"
  },
  snake: {
    a: "a",
    b: "b",
    c: "c"
  }
}

const ExampleComponent = (role: Role) => {
  const setup = record[role]
  return setup.a
}


// bad example

const ExampleComponent2 = (role: Role) => {
  switch (role) {
    case "snake":
      return "a"
    case "admin":
      return "a"
  }
}
