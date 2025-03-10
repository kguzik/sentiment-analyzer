import './Footer.scss';

type FooterProps = {
  copyright: string;
};

const Footer: React.FC<FooterProps> = ({ copyright }) => {
  return (
    <footer className="footer">
      <p className="footer__content text-small">{copyright}</p>
    </footer>
  );
};

export default Footer;
