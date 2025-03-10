import './Header.scss';

type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <h1 className="header__title text-small">{title}</h1>
    </header>
  );
};

export default Header;
