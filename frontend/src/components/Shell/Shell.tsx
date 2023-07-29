import { User } from "@/types";
import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  NavLink as MantineNavLink,
  Navbar,
  ScrollArea,
  Text,
  createStyles,
  getStylesRef,
  rem,
  useMantineTheme,
  Group,
  Switch,
  useMantineColorScheme,
  Flex,
  Avatar,
} from "@mantine/core";
import { NavLink, Location } from "react-router-dom";
import {
  IconJacket,
  IconBook,
  IconSettingsCog,
  IconLogout,
  IconDashboard,
  IconSun,
  IconMoonStars,
  IconUsers,
  IconScribble,
} from "@tabler/icons-react";
import { ReactNode, useState } from "react";

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
  },
  footer: {
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
  },
  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
    "&.active, &.active:hover": {
      backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
      },
    },
  },
  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    size: "1rem",
  },
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    borderBottom: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
}));

type Link = {
  label: string;
  icon: React.FC<any>;
} & (
  | {
      to: string;
    }
  | {
      children: Link[];
    }
);
const config: Link[] = [
  { label: "Dashboard", icon: IconDashboard, to: "/dashboard" },
  { label: "Playground", icon: IconJacket, to: "/playground" },
  { label: "Recipes", icon: IconBook, to: "/recipes" },
  { label: "Logs", icon: IconScribble, to: "/logs" },
  { label: "Users", icon: IconUsers, to: "/users" },
  {
    label: "Settings",
    icon: IconSettingsCog,
    to: "/settings",
    // children: [
    //   { label: "Platform", icon: IconMathSymbols, to: "/settings/platform" },
    //   { label: "Models", icon: IconMathSymbols, to: "/settings/models" },
    //   { label: "Users", icon: IconMathSymbols, to: "/users" },
    // ],
  },
];
const getLinks = (links: Link[]) => {
  const { classes } = useStyles();
  return links.map((item) => {
    if (!("children" in item)) {
      return (
        <MantineNavLink
          key={item.to}
          component={NavLink}
          to={item.to}
          className={classes.link}
          icon={<item.icon className={classes.linkIcon} size="1.2rem" strokeWidth={1.5} />}
          label={item.label}
        ></MantineNavLink>
      );
    }

    return (
      <MantineNavLink
        key={item.label}
        className={classes.link}
        icon={<item.icon className={classes.linkIcon} size="1.2rem" strokeWidth={1.5} />}
        label={item.label}
      >
        {getLinks(item.children)}
      </MantineNavLink>
    );
  });
};

export interface ShellProps {
  children: ReactNode;
  user: User;
  location: Location;
  onLogout?: () => void;
}

export const Shell = ({ children, user, onLogout }: ShellProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { classes, cx } = useStyles();

  const header = (
    <Header height={{ base: 50 }} p="md">
      <Flex style={{ display: "flex", alignItems: "center", height: "100%" }}>
        {/* burger */}
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            color={theme.colors.gray[6]}
            mr="xl"
            opened={isOpened}
            size="sm"
            onClick={() => setIsOpened((value) => !value)}
          />
        </MediaQuery>

        {/* content */}
        <Flex align="center" justify="space-between" style={{ flex: 1 }}>
          {/* left */}
          <Text>LangToolkit</Text>

          {/* theme switcher */}
          <Group position="center">
            <Switch
              checked={colorScheme === "dark"}
              onChange={() => toggleColorScheme()}
              size="lg"
              onLabel={<IconSun color={theme.white} size="1.25rem" stroke={1.5} />}
              offLabel={<IconMoonStars color={theme.colors.gray[6]} size="1.25rem" stroke={1.5} />}
            />
          </Group>
        </Flex>
      </Flex>
    </Header>
  );

  const navbar = (
    <Navbar hidden={!isOpened} hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      {/* navigation */}
      <Navbar.Section component={ScrollArea} grow>
        {getLinks(config)}
      </Navbar.Section>

      {/* footer */}
      <Navbar.Section className={classes.footer}>
        {/* user */}
        <NavLink className={cx(classes.link, classes.user)} to={"/profile"}>
          <Group>
            <Avatar bg="cyan" src={user.avatar} radius="xl" />
            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {user.name}
              </Text>
              <Text color="dimmed" size="xs">
                {user.email}
              </Text>
            </div>
          </Group>
        </NavLink>
        {/* logout */}
        <MantineNavLink
          icon={<IconLogout className={classes.linkIcon} size="1rem" />}
          className={classes.link}
          variant="white"
          onClick={onLogout}
          label="Logout"
        />
      </Navbar.Section>
    </Navbar>
  );

  return (
    <AppShell
      header={header}
      navbar={navbar}
      navbarOffsetBreakpoint="sm"
      styles={{
        main: {
          background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
    >
      {children}
    </AppShell>
  );
};
