import { Stack } from "@mui/system";
import React from "react";
import useResponsive from "../../hooks/useResponsive";
import Menu from "../appMenu";
import SecureHeader from "../secureHeader";
import WithPreckSession from "../../controls/hoc/Session";
import Alert from "../alert";
import { BloomReact, Logo, Page } from "@bloom-trade/react-sdk";
import { authService } from "../../services/auth.services";
import { User } from "@bloom-trade/types";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactNode;
  title?: string;
  currentLink?: string;
}

const LogoLarge = () => {
  return (
    <svg width="102" height="34" viewBox="0 0 102 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_49_23401)">
        <path
          d="M47.7009 14.1325C47.0394 13.9275 46.3499 13.8269 45.6573 13.8344C43.6425 13.8344 42.1278 14.5316 41.1564 15.8973C40.1851 17.2629 39.7139 19.1863 39.7139 21.6676C39.7139 24.1488 40.1947 26.1011 41.1564 27.4379C42.1182 28.7747 43.6425 29.4767 45.6573 29.4767C46.3429 29.4853 47.0258 29.388 47.6818 29.1882C47.7219 29.1759 47.7585 29.1543 47.7886 29.125C47.8187 29.0957 47.8414 29.0597 47.8549 29.0199C47.8673 28.9806 47.8708 28.9391 47.865 28.8983C47.8591 28.8575 47.8441 28.8185 47.8212 28.7843C47.3313 28.0518 46.9294 27.2642 46.6238 26.4377C45.554 23.3212 45.554 19.937 46.6238 16.8205C46.8752 16.1348 47.1975 15.4773 47.5855 14.8586L47.6289 14.7913C47.6721 14.7192 47.7202 14.647 47.7683 14.5749C47.8193 14.5353 47.855 14.4792 47.8693 14.4162C47.8767 14.3569 47.8641 14.2969 47.8337 14.2456C47.8032 14.1942 47.7565 14.1544 47.7009 14.1325Z"
          fill="white"
        />
        <path
          d="M61.3431 15.8876C60.3814 14.5604 58.9389 13.8728 57.0491 13.8392H56.9962C56.7817 13.8248 56.5664 13.8248 56.3519 13.8392C55.8826 13.8695 55.4181 13.9517 54.967 14.0844C54.9071 14.0742 54.8455 14.0862 54.7938 14.1181C54.7351 14.1523 54.6918 14.208 54.673 14.2733C54.6542 14.3387 54.6613 14.4088 54.6929 14.4691L55.8806 16.8734C56.929 19.9819 56.929 23.3485 55.8806 26.4569C55.5809 27.2803 55.1838 28.0649 54.6977 28.7939C54.6754 28.8294 54.6613 28.8693 54.6563 28.9109C54.6513 28.9525 54.6556 28.9946 54.6689 29.0343C54.6829 29.0732 54.7059 29.1083 54.736 29.1367C54.766 29.1651 54.8023 29.186 54.842 29.1978C55.5103 29.4015 56.2062 29.5005 56.9048 29.4912C58.8908 29.4912 60.3862 28.8083 61.348 27.4619C62.3097 26.1155 62.7905 24.2017 62.7905 21.6916C62.7905 19.1815 62.2856 17.2196 61.3431 15.8876Z"
          fill="white"
        />
        <path
          d="M0 32.1599V1.86571C0 1.61064 0.101338 1.36601 0.281695 1.18565C0.462053 1.00529 0.706656 0.903985 0.961721 0.903985H11.1271C12.9471 0.87101 14.7637 1.07304 16.532 1.50506C17.8589 1.83036 19.1089 2.41367 20.2106 3.22174C21.1359 3.9218 21.8621 4.8518 22.3167 5.91935C22.7753 7.05051 23.0026 8.26207 22.9851 9.48252C22.9891 10.2203 22.8755 10.954 22.6485 11.656C22.4194 12.3529 22.0694 13.0039 21.6146 13.5795C21.1085 14.2151 20.5066 14.7683 19.8307 15.2192C19.0323 15.7469 18.1672 16.1657 17.2581 16.4646C21.682 17.4584 23.8955 19.8515 23.8987 23.6439C23.9118 24.9464 23.6462 26.2367 23.1197 27.4282C22.5974 28.587 21.8199 29.6128 20.8453 30.4288C19.7573 31.3165 18.5083 31.9859 17.1667 32.4003C15.5508 32.8989 13.8662 33.1391 12.1754 33.112H0.952094C0.700357 33.1095 0.459651 33.0084 0.281637 32.8304C0.103623 32.6523 0.00250503 32.4116 0 32.1599ZM5.9915 13.8872C5.9915 14.1423 6.09284 14.3869 6.2732 14.5672C6.45355 14.7476 6.69816 14.8489 6.95322 14.8489H10.8001C12.8357 14.8489 14.3809 14.4771 15.4356 13.7333C16.4903 12.9896 17.0177 11.8083 17.0177 10.1894C17.0177 8.51119 16.5368 7.30422 15.5751 6.60217C14.6134 5.90011 13.1371 5.53467 11.1175 5.53467H6.94365C6.68859 5.53467 6.44393 5.63598 6.26357 5.81634C6.08321 5.9967 5.98193 6.24133 5.98193 6.49639L5.9915 13.8872ZM5.9915 19.9364V27.4811C5.9915 27.7362 6.09284 27.9808 6.2732 28.1612C6.45355 28.3415 6.69816 28.4429 6.95322 28.4429H12.0888C13.0363 28.4677 13.981 28.3311 14.8826 28.0389C15.5562 27.8198 16.1734 27.4554 16.6906 26.9714C17.1302 26.5357 17.4598 26.0016 17.6524 25.4134C17.8568 24.8028 17.9592 24.1627 17.9553 23.5188C17.9659 22.8747 17.8516 22.2345 17.6187 21.6339C17.4009 21.0712 17.0414 20.5743 16.5752 20.1913C16.0363 19.765 15.4138 19.457 14.748 19.2873C13.8668 19.0632 12.9595 18.9581 12.0504 18.9747H6.93884C6.81213 18.9766 6.68702 19.0035 6.57074 19.0539C6.45446 19.1043 6.34925 19.1771 6.26122 19.2683C6.17319 19.3594 6.10406 19.4671 6.05777 19.585C6.01148 19.703 5.98895 19.829 5.9915 19.9557V19.9364Z"
          fill="#525251"
        />
        <path
          d="M32.3571 0.947316V32.16C32.3571 32.415 32.2558 32.6596 32.0754 32.84C31.8951 33.0204 31.6505 33.1217 31.3954 33.1217H27.7938C27.5387 33.1217 27.294 33.0204 27.1137 32.84C26.9333 32.6596 26.832 32.415 26.832 32.16V0.947316C26.832 0.692252 26.9333 0.447649 27.1137 0.267291C27.294 0.0869335 27.5387 -0.0144043 27.7938 -0.0144043H31.3954C31.6505 -0.0144043 31.8951 0.0869335 32.0754 0.267291C32.2558 0.447649 32.3571 0.692252 32.3571 0.947316Z"
          fill="#525251"
        />
        <path
          d="M45.6578 9.89127C47.2447 9.86871 48.8213 10.1494 50.3029 10.7183C51.6414 11.2333 52.8534 12.0304 53.8565 13.0553C54.8666 14.1158 55.6417 15.3775 56.1309 16.7579C57.1946 19.9314 57.1946 23.3652 56.1309 26.5387C55.6384 27.9233 54.8639 29.1906 53.8565 30.2605C52.8585 31.2975 51.6456 32.1034 50.3029 32.6215C47.2994 33.7244 44.0018 33.7244 40.9983 32.6215C39.6491 32.1025 38.4284 31.2969 37.4206 30.2605C36.4072 29.1917 35.6262 27.9244 35.127 26.5387C34.0436 23.3684 34.0436 19.9282 35.127 16.7579C35.623 15.3763 36.4045 14.1147 37.4206 13.0553C38.4335 12.0309 39.6531 11.2341 40.9983 10.7183C42.4849 10.1494 44.0662 9.86876 45.6578 9.89127ZM45.6578 29.2122C47.5556 29.2122 48.9629 28.5711 49.8797 27.2888C50.7966 26.0065 51.2534 24.1344 51.2502 21.6724C51.2502 19.2039 50.7934 17.3238 49.8797 16.0319C48.9661 14.74 47.5588 14.0988 45.6578 14.1084C43.7343 14.1084 42.3078 14.7592 41.3782 16.0607C40.4485 17.3622 39.9869 19.2376 39.9933 21.6868C39.9933 24.1391 40.4549 26.0065 41.3782 27.2888C42.3014 28.5711 43.7279 29.2122 45.6578 29.2122Z"
          fill="#525251"
        />
        <path
          d="M69.3877 32.1599V11.1992C69.3877 10.9441 69.489 10.6995 69.6693 10.5192C69.8497 10.3388 70.0944 10.2375 70.3494 10.2375H72.7537C73.0683 10.2148 73.3808 10.3029 73.6373 10.4864C73.8937 10.67 74.0778 10.9374 74.1578 11.2425L74.4223 12.4927C74.4313 12.535 74.4517 12.574 74.4814 12.6055C74.5111 12.637 74.5488 12.6596 74.5905 12.6711C74.6322 12.6825 74.6763 12.6822 74.7179 12.6703C74.7595 12.6583 74.7969 12.6352 74.8262 12.6033C75.1312 12.2888 75.4522 11.9903 75.7879 11.7089C76.2219 11.3412 76.6924 11.0189 77.192 10.7472C77.701 10.4741 78.24 10.2611 78.7981 10.1125C79.4113 9.94927 80.0438 9.86998 80.6783 9.87683C81.9665 9.82461 83.2302 10.2396 84.2367 11.0453C84.7827 11.5109 85.2503 12.0613 85.6215 12.6754C85.7039 12.802 85.8149 12.9074 85.9456 12.983C86.0763 13.0587 86.223 13.1025 86.3738 13.1109C86.5245 13.1194 86.6752 13.0922 86.8135 13.0315C86.9518 12.9709 87.0739 12.8786 87.1699 12.762C87.3199 12.5674 87.4804 12.3812 87.6508 12.2042C88.1676 11.6775 88.761 11.2317 89.4107 10.8818C90.0532 10.5382 90.7389 10.2827 91.4496 10.1221C92.1627 9.9596 92.8916 9.87733 93.623 9.87683C94.7717 9.85569 95.914 10.0532 96.989 10.4587C97.9353 10.8193 98.7824 11.3994 99.4607 12.1513C100.155 12.9397 100.676 13.8653 100.99 14.8682C101.355 16.0596 101.532 17.3007 101.514 18.5468V32.1455C101.514 32.4005 101.413 32.6452 101.232 32.8255C101.052 33.0059 100.807 33.1072 100.552 33.1072H96.9506C96.6955 33.1072 96.4509 33.0059 96.2706 32.8255C96.0902 32.6452 95.9889 32.4005 95.9889 32.1455V18.5612C95.9889 17.1186 95.6667 16.0078 95.0271 15.2721C94.6699 14.8919 94.2327 14.5959 93.747 14.4054C93.2613 14.215 92.7394 14.1349 92.2189 14.1709C91.6812 14.1655 91.1473 14.2634 90.6465 14.4594C90.1705 14.6485 89.7385 14.9333 89.377 15.2961C88.9969 15.6873 88.7036 16.1543 88.5163 16.6666C88.3006 17.2744 88.1964 17.9163 88.2086 18.5612V32.1599C88.2086 32.415 88.1072 32.6596 87.9269 32.8399C87.7465 33.0203 87.5019 33.1216 87.2469 33.1216H83.6211C83.3661 33.1216 83.1215 33.0203 82.9411 32.8399C82.7608 32.6596 82.6594 32.415 82.6594 32.1599V18.5612C82.6594 17.032 82.3517 15.91 81.7362 15.1951C81.3852 14.8314 80.9588 14.549 80.4869 14.3679C80.015 14.1868 79.5091 14.1113 79.0049 14.1469C78.2267 14.1445 77.4618 14.3486 76.7881 14.7383C76.1639 15.0978 75.598 15.5502 75.1099 16.0799C74.9471 16.2548 74.8577 16.4854 74.8599 16.7243V32.1118C74.8599 32.3669 74.7585 32.6115 74.5782 32.7919C74.3978 32.9722 74.1532 33.0736 73.8982 33.0736H70.2965C70.0588 33.0607 69.8343 32.9602 69.6665 32.7914C69.4986 32.6227 69.3993 32.3977 69.3877 32.1599Z"
          fill="#525251"
        />
        <path
          d="M67.3732 16.758C66.8875 15.3769 66.1138 14.1149 65.1035 13.0553C64.0996 12.0314 62.8879 11.2345 61.55 10.7183C58.5465 9.61553 55.2489 9.61553 52.2453 10.7183C51.9162 10.8465 51.5951 10.9942 51.2836 11.1608C52.0426 11.5404 52.7436 12.0261 53.3657 12.6033C53.964 13.1397 54.4967 13.7449 54.9526 14.4066C55.5845 14.2107 56.2433 14.1149 56.9048 14.1228C58.8091 14.1228 60.218 14.764 61.1316 16.0463C62.0453 17.3286 62.5021 19.2087 62.5021 21.6868C62.5021 24.1552 62.0453 26.0274 61.1316 27.3032C60.218 28.5791 58.8091 29.2203 56.9048 29.2267C54.9814 29.2267 53.5564 28.5855 52.63 27.3032C51.7035 26.021 51.2419 24.1536 51.2451 21.7012C51.2408 20.9564 51.2906 20.2124 51.3942 19.4748C51.0681 18.4086 50.6397 17.3764 50.1151 16.3925C49.8497 15.9053 49.4904 15.4755 49.0579 15.1281C48.6254 14.7806 48.1283 14.5223 47.5954 14.3681C47.0919 15.1048 46.6817 15.9011 46.374 16.7387C45.2907 19.909 45.2907 23.3492 46.374 26.5194C46.8711 27.9062 47.6523 29.1739 48.6677 30.2413C49.6737 31.2799 50.8948 32.0857 52.2453 32.6023C55.2489 33.7051 58.5465 33.7051 61.55 32.6023C62.892 32.0829 64.1047 31.2772 65.1035 30.2413C66.1112 29.1724 66.8843 27.9047 67.3732 26.5194C68.444 23.3471 68.444 19.911 67.3732 16.7387V16.758Z"
          fill="#FF0083"
        />
        <path
          d="M54.9475 14.3873C55.5795 14.1914 56.2382 14.0957 56.8998 14.1036H57.0489C57.0463 14.0958 57.0463 14.0874 57.0489 14.0795C56.3484 12.5186 55.2238 11.1858 53.803 10.2327C53.2757 10.3544 52.7582 10.5151 52.2547 10.7135C51.9256 10.8417 51.6044 10.9894 51.293 11.1559C52.0519 11.5356 52.753 12.0213 53.3751 12.5985C53.9674 13.1311 54.4952 13.7315 54.9475 14.3873Z"
          fill="#EA0080"
        />
        <path
          d="M51.2641 22.6149C51.2641 22.312 51.2641 22.0042 51.2641 21.6821C51.2543 20.9442 51.2977 20.2065 51.3939 19.4749C51.0678 18.4087 50.6395 17.3764 50.1148 16.3926C49.8494 15.9054 49.4902 15.4756 49.0577 15.1281C48.6252 14.7807 48.1281 14.5224 47.5951 14.3682C47.5182 14.4836 47.4413 14.6038 47.3691 14.724C49.3301 16.9718 50.6724 19.6912 51.2641 22.6149Z"
          fill="#EA0080"
        />
      </g>
      <defs>
        <clipPath id="clip0_49_23401">
          <rect width="101.5" height="33.4486" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const LogoSmall = () => {
  return (
    <svg width="36" height="36" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" rx="24" fill="#F82A91" />
      <path
        d="M76.12 219C70.488 219 66.136 217.549 63.064 214.648C60.1627 211.576 58.712 207.224 58.712 201.592V55.928C58.712 50.296 60.1627 46.0293 63.064 43.128C66.136 40.056 70.488 38.52 76.12 38.52H137.56C150.189 38.52 160.941 40.3973 169.816 44.152C178.691 47.9067 185.432 53.2827 190.04 60.28C194.819 67.2773 197.208 75.64 197.208 85.368C197.208 96.2907 194.051 105.507 187.736 113.016C181.421 120.525 172.803 125.56 161.88 128.12V124.28C174.509 126.157 184.323 130.936 191.32 138.616C198.317 146.296 201.816 156.28 201.816 168.568C201.816 184.611 196.355 197.069 185.432 205.944C174.68 214.648 159.661 219 140.376 219H76.12ZM90.2 194.168H136.28C147.885 194.168 156.419 191.949 161.88 187.512C167.341 182.904 170.072 176.077 170.072 167.032C170.072 157.816 167.341 150.989 161.88 146.552C156.419 142.115 147.885 139.896 136.28 139.896H90.2V194.168ZM90.2 115.064H131.928C143.192 115.064 151.555 112.931 157.016 108.664C162.648 104.227 165.464 97.7413 165.464 89.208C165.464 80.6747 162.648 74.2747 157.016 70.008C151.555 65.5707 143.192 63.352 131.928 63.352H90.2V115.064Z"
        fill="#EDFFF6"
      />
    </svg>
  );
};

const Component = (props: Props): JSX.Element => {
  const mdUp = useResponsive("up", "md");
  const { getUserLoggedIn } = useAuth();
  const router = useRouter();
  const itemsNavigatorMenu = [
    {
      id: "overview",
      icon: "iconoir:stats-down-square",
      text: "Overview",
      navigate: () => router.push("/dashboard"),
    },
    {
      id: "my-wallets",
      icon: "uiw:pay",
      text: "My Wallets",
      navigate: () => router.push("/wallets"),
    },
    {
      id: "payment-request",
      icon: "ph:rocket",
      text: "Payment Request",
      navigate: () => router.push("/paymentRequest"),
    },
    {
      id: "payouts",
      icon: "icon-park-outline:bitcoin",
      text: "Payout",
      navigate: () => router.push("/payments/payout"),
    },
    {
      id: "plugins-integrations",
      icon: "clarity:plugin-outline-badged",
      text: "Plugins",
      navigate: () => router.push("/integrations"),
    },
  ];

  return (
    <BloomReact credentials={authService.getToken() as string} useTestnet={true}>
      <Stack>
        <Stack direction="row" position={"absolute"} width="100%" justifyContent={"center"} top={10}>
          <Alert />
        </Stack>

        <Page
          currentLink={props.currentLink as string}
          logo={
            <Logo
              image={{
                small: <LogoSmall />,
                large: <LogoLarge />,
              }}
            />
          }
          user={getUserLoggedIn()}
          header={{
            title: props.title as string,
          }}
          navigationItems={itemsNavigatorMenu}
        >
          {props.children}
        </Page>
      </Stack>
    </BloomReact>
  );
};

export default WithPreckSession(Component);
