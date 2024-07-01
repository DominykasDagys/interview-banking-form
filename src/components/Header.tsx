import { FC, useState } from "react";
import { useSettingsStore } from "@/store/settings";
import { Language, LANGUAGES } from "@/types/settings";
import { AppBar, Box, Button, Menu, MenuItem } from "@mui/material";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const { language, setLanguage } = useSettingsStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLang = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const lang = e.currentTarget.getAttribute("value") as Language;
    setLanguage(lang);
    handleClose();
  };

  return (
    <AppBar>
      <Box display="flex" justifyContent="flex-end" py="1rem" px="2rem">
        <Button variant="contained" onClick={handleClick}>
          Language - {language}
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {Object.values(LANGUAGES).map((lang) => (
            <MenuItem key={lang} value={lang} onClick={handleChangeLang}>
              {lang.toUpperCase()}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </AppBar>
  );
};

export default Header;
