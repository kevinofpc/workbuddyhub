import { siteConfig } from "@/config/site";
import { getBaseUrl } from "@/lib/utils";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import {
  anchor,
  box,
  container,
  footer,
  footerLeft,
  footerRight,
  hr,
  main,
  paragraph,
} from "./email-formats";

export const NewsletterWelcomeEmail = ({ email }: { email: string }) => {
  const baseUrl = getBaseUrl();
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

  return (
    <Html>
      <Head />
      <Preview>欢迎加入 WorkBuddy Weekly</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src={`${baseUrl}/workbuddy-mark.svg`}
              width="32"
              height="32"
              alt="Logo"
            />
            <Hr style={hr} />
            <Text style={paragraph}>
              欢迎加入 WorkBuddy Hub。我们会把真正有用的学习路径、实战配方、
              案例拆解和精选资源送到你的邮箱。
            </Text>
            <Text style={paragraph}>
              我们重视每一条反馈。如果你发现内容失效，或者有值得推荐的资源，
              欢迎随时回复这封邮件。
            </Text>
            <Text style={paragraph}>
              祝学习顺利，
              <br />
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>{" "}
              编辑团队
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              <span style={footerLeft}>
                &copy; {new Date().getFullYear()}
                &nbsp; WorkBuddy 学习与最佳实践中心
              </span>

              <span style={footerRight}>
                <Link style={anchor} href={siteConfig.links.github}>
                  GitHub
                </Link>
              </span>
            </Text>
            <Text style={footer}>
              <span>
                如果你不想继续接收更新，可以
                <Link style={anchor} href={unsubscribeUrl} target="_blank">
                  点击退订
                </Link>
                。
              </span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterWelcomeEmail;

NewsletterWelcomeEmail.PreviewProps = {
  email: "hello@workbuddyhub.com",
};
