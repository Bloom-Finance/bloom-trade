import { Stack, Typography } from "@mui/material";
import { GraySmoth } from "../../theme";
import useResponsive from "../../hooks/useResponsive";

export interface NoItemsCardsProps {
  title: string;
  description: string;
  actionSection?: JSX.Element;
}

const NoItemsCard = (props: NoItemsCardsProps): JSX.Element => {
  const mdUp = useResponsive("up", "md");
  return (
    <Stack
      p={mdUp ? 4 : 0}
      spacing={2}
      width={mdUp ? "50%" : "100%"}
      sx={{
        boxShadow: mdUp
          ? "0px 0px 2px rgba(145, 158, 171, 0.24), 0px 16px 32px -4px rgba(145, 158, 171, 0.24)"
          : "none",
        borderRadius: "16px",
      }}
    >
      <Stack
        direction={mdUp ? "row" : "column"}
        alignItems={"center"}
        spacing={2}
        justifyContent={mdUp ? "start" : "center"}
      >
        <Stack>
          <Icon />
        </Stack>

        <Stack spacing={2}>
          <Typography
            variant="subtitle1"
            align={mdUp ? "left" : "center"}
            sx={{
              color: GraySmoth,
            }}
          >
            {props.title}
          </Typography>
          <Typography
            variant="body1"
            align={mdUp ? "left" : "center"}
            sx={{
              color: GraySmoth,
            }}
          >
            {props.description}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent={mdUp ? "end" : "center"}>
        {props.actionSection}
      </Stack>
    </Stack>
  );
};

export default NoItemsCard;

const Icon = () => {
  return (
    <svg
      width="130"
      height="134"
      viewBox="0 0 130 134"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.93313 29.0315C8.44796 28.5265 9.33161 26.8855 8.82667 25.3707C8.32173 23.8558 6.68066 22.9722 5.0396 23.4771C3.52477 23.9821 2.64112 25.6231 3.14606 27.138C3.651 28.6528 5.29207 29.5364 6.93313 29.0315Z"
        fill="#EAEEF9"
      />
      <path
        d="M13.3712 19.4377C14.381 19.059 15.0122 17.9229 14.6335 16.913C14.2548 15.9031 13.1187 15.2719 12.1088 15.6506C11.0989 16.0293 10.4677 17.1655 10.8464 18.1754C11.0989 19.1852 12.235 19.8164 13.3712 19.4377Z"
        fill="#EAEEF9"
      />
      <path
        d="M120.239 42.3788C122.132 40.7377 122.259 37.8343 120.491 36.067C118.85 34.2997 115.947 34.1735 114.179 35.8145C112.286 37.4556 112.16 40.359 113.927 42.1263C115.568 43.8936 118.471 44.0199 120.239 42.3788Z"
        fill="#EAEEF9"
      />
      <path
        d="M127.055 51.224C127.813 50.4666 127.939 49.3305 127.182 48.5731C126.424 47.8157 125.288 47.6894 124.531 48.4469C123.773 49.2043 123.647 50.3404 124.404 51.0978C125.036 51.9815 126.298 51.9815 127.055 51.224Z"
        fill="#EAEEF9"
      />
      <path
        d="M12.1086 126.107C12.866 125.349 12.9922 124.213 12.2348 123.456C11.4774 122.698 10.3413 122.572 9.58384 123.33C8.82642 124.087 8.70019 125.223 9.4576 125.981C10.215 126.738 11.3511 126.864 12.1086 126.107Z"
        fill="#EAEEF9"
      />
      <path
        d="M59.8259 132.293C92.2685 132.293 118.652 106.036 118.652 73.7192C118.526 41.2766 92.2685 15.0195 59.8259 15.0195C27.257 15.0195 1 41.2766 1 73.593C1 106.036 27.257 132.293 59.8259 132.293Z"
        fill="#F1F3F9"
        stroke="#D6DCE8"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M98.8653 43.4018V47.9383H98.5163H94.0962L26.2818 47.7056C25.0023 47.7056 23.7228 47.473 22.4433 47.124C22.3269 47.124 22.2106 47.0077 22.0943 47.0077C20.4658 46.4261 19.07 45.7282 17.9068 44.565C16.9762 43.6345 16.2783 42.2386 16.2783 40.9591C16.2783 38.5164 18.2558 36.6553 21.0474 35.4921C21.978 35.0268 23.1412 34.7942 24.3044 34.6778C24.7697 34.6778 25.2349 34.5615 25.7002 34.5615H90.025C90.7229 34.5615 91.3045 34.6778 91.8861 34.7942C92.3514 34.9105 92.8167 35.0268 93.2819 35.2594C96.6552 36.6553 98.8653 39.6796 98.8653 43.4018Z"
        fill="#F1F3F9"
        stroke="#D6DCE8"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M107.124 55.0334V112.146C107.124 116.101 103.983 119.242 100.029 119.242H31.5163C25.8166 119.242 21.3965 116.567 18.6048 114.356C17.3253 113.31 16.5111 111.681 16.5111 110.053C16.5111 109.238 16.5111 108.424 16.5111 107.61C16.5111 106.447 16.5111 105.051 16.5111 103.655C16.5111 97.1412 16.5111 88.4172 16.3947 79.5769C16.3947 78.2974 16.3947 77.0179 16.3947 75.622C16.3947 70.9692 16.3947 66.3165 16.2784 61.8963C16.2784 60.6168 16.2784 59.3373 16.2784 57.9414C16.2784 49.2175 16.1621 42.7036 16.1621 41.1914C16.1621 43.7504 18.6048 46.0768 21.8618 47.0074C21.9781 47.0074 22.0944 47.1237 22.2107 47.1237C23.3739 47.4727 24.7698 47.7053 26.0493 47.7053L93.8637 48.0543H98.7491H99.9123C103.983 47.9379 107.124 51.0786 107.124 55.0334Z"
        fill="white"
        stroke="#D6DCE8"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M107.124 71.2021V73.2959C107.008 73.2959 106.891 73.2959 106.659 73.2959H92.7004C90.2577 73.2959 88.164 74.2265 86.6518 75.7386C85.256 77.1344 84.2091 79.2282 84.0928 81.4383C84.0928 81.5546 84.0928 81.7872 84.0928 81.9036C84.0928 86.6727 87.9313 90.5112 92.7004 90.5112H106.659C107.357 90.5112 107.938 90.2786 108.171 89.9296C108.287 89.8133 108.404 89.5807 108.404 89.4643V72.249C108.404 71.6674 107.822 71.3185 107.124 71.2021Z"
        fill="white"
        stroke="#D6DCE8"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M93.0021 86.3832C95.4456 86.3832 97.4818 84.347 97.4818 81.9035C97.4818 79.46 95.4456 77.4238 93.0021 77.4238C90.5587 77.4238 88.5225 79.46 88.5225 81.9035C88.5225 84.347 90.5587 86.3832 93.0021 86.3832Z"
        fill="#F1F3F9"
        stroke="#D6DCE8"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M47.3578 86.5451C49.2797 86.5451 50.9059 84.9188 50.9059 82.9969C50.9059 81.075 49.2797 79.4487 47.3578 79.4487C45.4358 79.4487 43.8096 81.075 43.8096 82.9969C43.8096 84.9188 45.4358 86.5451 47.3578 86.5451Z"
        fill="#AAB2C5"
      />
      <path
        d="M74.5604 86.5451C76.4823 86.5451 78.1086 84.9188 78.1086 82.9969C78.1086 81.075 76.4823 79.4487 74.5604 79.4487C72.6384 79.4487 71.0122 81.075 71.0122 82.9969C71.0122 85.0667 72.6384 86.5451 74.5604 86.5451Z"
        fill="#AAB2C5"
      />
      <path
        d="M47.2192 71.2583L39.4141 75.4727L40.4677 77.4239L48.2728 73.2096L47.2192 71.2583Z"
        fill="#AAB2C5"
      />
      <path
        d="M74.0783 71.2023L73.0249 73.1538L80.8309 77.3673L81.8843 75.4158L74.0783 71.2023Z"
        fill="#AAB2C5"
      />
      <path
        d="M60.9594 94.8241C63.2456 94.8241 65.0989 93.4341 65.0989 91.7194C65.0989 90.0047 63.2456 88.6147 60.9594 88.6147C58.6732 88.6147 56.8198 90.0047 56.8198 91.7194C56.8198 93.4341 58.6732 94.8241 60.9594 94.8241Z"
        fill="#AAB2C5"
      />
      <path
        d="M121.889 5.64864C110.344 3.11687 97.9894 3.52195 86.6471 6.86389C84.3178 7.57279 81.7861 8.48423 79.9632 10.1046C77.1276 12.4338 75.9124 16.5859 76.8238 20.1304C77.7352 23.6749 80.7734 26.6117 84.5204 27.3206C86.8496 27.9283 89.6852 27.1181 91.103 25.1939C92.4195 23.1685 92.1157 20.1304 90.4954 18.3075C88.875 16.2821 86.242 15.4719 83.8115 15.5732C81.381 15.6745 78.9505 16.5859 76.8238 17.6999C69.9374 21.4469 64.3675 28.0295 62.0382 35.7261C60.8575 39.4651 60.4416 43.3954 60.744 47.2614"
        stroke="#C9D4E2"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-dasharray="4 4"
      />
      <path
        d="M127.965 3.01576C127.864 4.53482 127.763 5.95261 126.649 6.25643C125.535 6.56024 125.028 5.54753 124.32 4.12974C123.611 2.81321 124.016 1.39542 125.231 1.09161C126.345 0.787794 128.168 1.19288 127.965 3.01576Z"
        fill="#F1F3F9"
        stroke="#D6DCE8"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M126.75 10.3074C127.054 8.48457 127.358 7.47186 126.345 6.96551C125.231 6.45915 124.522 7.37059 123.307 8.58584C122.294 9.69982 122.902 11.3202 123.915 11.8265C125.13 12.4341 126.446 11.8265 126.75 10.3074Z"
        fill="#F1F3F9"
        stroke="#D6DCE8"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M128.168 6.96555C128.067 7.67445 127.561 8.1808 126.852 8.28207C126.548 8.28207 126.244 8.28207 125.839 8.28207C124.421 8.07953 123.307 7.16809 123.409 6.25665C123.51 5.34521 124.827 4.83886 126.447 5.0414C126.751 5.0414 127.054 5.14267 127.257 5.24394C127.865 5.44648 128.27 6.15538 128.168 6.96555C128.168 6.86428 128.168 6.96555 128.168 6.96555Z"
        fill="#F1F3F9"
      />
      <path
        d="M128.168 6.96555C128.067 7.67445 127.561 8.1808 126.852 8.28207C126.548 8.28207 126.244 8.28207 125.839 8.28207C124.421 8.07953 123.307 7.16809 123.409 6.25665C123.51 5.34521 124.827 4.83886 126.447 5.0414C126.751 5.0414 127.054 5.14267 127.257 5.24394C127.865 5.44648 128.27 6.15538 128.168 6.96555ZM128.168 6.96555C128.168 6.86428 128.168 6.96555 128.168 6.96555Z"
        stroke="#D6DCE8"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M16.6836 22.2056C16.6836 20.484 16.6836 18.7624 17.8988 18.256C19.2154 17.7497 19.9243 18.9649 20.937 20.6865C21.8484 22.2056 21.4433 23.8259 20.1268 24.3323C19.0128 24.8386 16.6836 24.5348 16.6836 22.2056Z"
        fill="#F1F3F9"
        stroke="#D6DCE8"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M17.3925 13.6991C17.19 15.8258 16.8861 17.041 18.2027 17.5474C19.5192 18.0538 20.2281 16.9398 21.5446 15.3194C22.5573 13.9016 21.8484 12.0788 20.5319 11.5724C19.2154 11.0661 17.595 11.9775 17.3925 13.6991Z"
        fill="#F1F3F9"
        stroke="#D6DCE8"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M16.2783 17.7498C16.2783 16.9396 16.8859 16.332 17.5948 16.2307C17.8987 16.1295 18.3037 16.1295 18.7088 16.2307C20.3292 16.332 21.747 17.2434 21.6457 18.2562C21.5444 19.2689 20.2279 19.9778 18.5063 19.7752C18.2025 19.7752 17.8987 19.674 17.5948 19.5727C16.7847 19.4714 16.2783 18.6612 16.2783 17.7498Z"
        fill="#F1F3F9"
        stroke="#D6DCE8"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M23.165 18.0537C33.7985 18.0537 53.4451 24.2312 53.7489 46.9159"
        stroke="#C9D4E2"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-dasharray="4 4"
      />
    </svg>
  );
};
