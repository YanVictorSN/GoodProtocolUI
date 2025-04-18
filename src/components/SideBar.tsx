import React, { useMemo } from 'react'
import { Box, View, useBreakpointValue, HStack, useColorModeValue, ScrollView } from 'native-base'
import { getDevice, useClaim } from '@gooddollar/web3sdk-v2'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useLocation } from 'react-router-dom'
import { SlideDownTab, useRedirectNotice, useScreenSize } from '@gooddollar/good-design'
import { useFeatureFlagWithPayload } from 'posthog-react-native'

import { useApplicationTheme } from '../state/application/hooks'
import LanguageSwitch from './LanguageSwitch'
import { ExternalLink } from 'theme'
import { SubMenuItems } from './StyledMenu/SubMenu'
import { socials } from 'constants/socials'
import classNames from 'classnames'

const SocialsLink: React.FC<{ network: string; logo: string; url: string; onPress: (e: any, url: string) => void }> = ({
    network,
    logo,
    url,
    onPress,
}) => {
    // type handling
    const handleClick = (e: any) => {
        onPress(e, url)
    }

    return (
        <a href={url} target="_blank" className="flex items-center space-x-2" rel="noreferrer" onClick={handleClick}>
            <img src={logo} alt={`${network} logo`} width="20" height="20" />
        </a>
    )
}

const externalPrivacyStyles = {
    paddingTop: '4px',
    fontSize: 14,
    paddingBottom: '1px',
    backgroundColor: 'transparent',
    color: '#8499BB',
}

export default function SideBar({ mobile, closeSidebar }: { mobile?: boolean; closeSidebar?: any }): JSX.Element {
    const [theme, setTheme] = useApplicationTheme()
    const { goToExternal } = useRedirectNotice()
    const { i18n } = useLingui()
    const { isWhitelisted } = useClaim()
    const { pathname } = useLocation()
    const isBuyGd = pathname.startsWith('/buy')

    const bgContainer = useColorModeValue('goodWhite.100', '#151A30')

    const { browser, os } = getDevice()
    const { isTabletView } = useScreenSize()
    const scrWidth = '100%'
    const isiOS = os.name === 'iOS'
    const isChrome = browser.name === 'Chrome'

    const viewPort = isiOS ? '98vh' : '100vh'
    const browserViewPort = isChrome && isiOS ? '160px' : '90px'

    const socialItems = Object.entries(socials)
    const firstRowItems = socialItems.slice(0, 4)
    const secondRowItems = socialItems.slice(4)

    const [, payload] = useFeatureFlagWithPayload('advanced-minipay-enabled')

    const containerStyles = useBreakpointValue({
        base: {
            width: '100%',
            flexShrink: 0,
            transition: 'all 1s ease',
            display: 'grid',
            paddingBottom: 0,
            height: `calc(${viewPort} - ${browserViewPort})`,
            gap: '1px',
            justifyContent: 'stretch',
        },
        lg: {
            width: '258px',
            height: 'auto',
            display: 'flex',
        },
    })

    const onTabClick = () => {
        if (mobile) {
            closeSidebar()
        }
    }

    const handleExternal = (e: any, url: string) => {
        onTabClick()
        goToExternal(e, url)
    }

    const footerStyles = classNames('flex flex-col justify-center gap-3 mt-2.5', {
        'w-full': !isTabletView,
    })

    const { ethereum } = window
    const isMinipay = ethereum?.isMiniPay
    const { bridgeEnabled = false, swapEnabled = false } = payload || {}

    const externalLinks = useMemo(
        () => [
            {
                subMenuTitle: 'Regular',
                items: [
                    {
                        label: i18n._(t`GoodCollective`),
                        url: 'https://goodcollective.xyz/',
                        dataAttr: 'goodcollective',
                        withIcon: true,
                        show: true,
                    },
                    {
                        label: i18n._(t`Buy G$`),
                        url: 'https://v2.app.squidrouter.com/',
                        dataAttr: 'buygd_squid',
                        withIcon: true,
                        show: !isMinipay,
                    },
                    {
                        label: i18n._(t`Dapps`),
                        url: 'https://example.com',
                        dataAttr: 'squid',
                        withIcon: true,
                        show: false, // will be added at a later stage
                    },
                ],
            },
            {
                subMenuTitle: 'More',
                items: [
                    {
                        label: i18n._(t`GoodWallet`),
                        url: 'https://wallet.gooddollar.org',
                        dataAttr: 'wallet',
                        withIcon: true,
                        show: true,
                    },
                    {
                        label: i18n._(t`Help & Documentation`),
                        url: 'https://docs.gooddollar.org',
                        dataAttr: 'docs',
                        withIcon: true,
                        show: true,
                    },
                    {
                        label: i18n._(t`Good Airdrop`),
                        url: 'https://airdrop.gooddollar.org',
                        dataAttr: 'airdrop',
                        withIcon: true,
                        show: true,
                    },
                ],
            },
        ],
        [i18n]
    )

    const internalLinks = useMemo(
        () => [
            {
                items: [
                    {
                        route: '/buy',
                        text: 'Buy G$',
                        show: isBuyGd, // todo: add post-hog feature flags for pages
                    },
                    {
                        route: '/claim',
                        text: 'Claim',
                        show: true,
                    },
                    {
                        route: '/news',
                        text: 'News',
                        show: true,
                    },
                ],
            },
            {
                subMenuTitle: 'Swap',
                items: [
                    {
                        route: '/swap/celoReserve',
                        text: 'GoodReserve (Celo)',
                        show: true,
                    },
                    {
                        text: i18n._(t`Uniswap (widget)`),
                        route: '/swap/celoUniswap',
                        dataAttr: 'swapcelo',
                        show: !isMinipay || swapEnabled,
                    },
                    {
                        label: i18n._(t`Voltage Finance (Fuse)`),
                        url: 'https://app.voltage.finance/',
                        dataAttr: 'voltage',
                        withIcon: true,
                        show: !isMinipay,
                    },
                    {
                        label: i18n._(t`Uniswap (Celo)`),
                        url: 'https://app.uniswap.org',
                        dataAttr: 'uniswap',
                        withIcon: true,
                        show: true,
                    },
                ],
            },
            {
                subMenuTitle: 'Bridges',
                items: [
                    {
                        route: '/microbridge',
                        text: 'Micro Bridge',
                        show: !isMinipay || bridgeEnabled,
                    },
                    {
                        label: i18n._(t`GoodDollar Main Bridge`),
                        url: 'https://docs.gooddollar.org/user-guides/bridge-gooddollars',
                        dataAttr: 'mainbridge',
                        withIcon: true,
                        show: !isMinipay || bridgeEnabled,
                    },
                    {
                        label: i18n._(t`Squid Router`),
                        url: 'https://v2.app.squidrouter.com/',
                        dataAttr: 'squid',
                        withIcon: true,
                        show: !isMinipay || bridgeEnabled,
                    },
                ],
            },
            {
                items: [
                    {
                        route: '/stakes',
                        text: 'Stake',
                        show: !isMinipay,
                    },
                    {
                        route: '/portfolio',
                        text: 'Portfolio',
                        show: !isMinipay,
                    },
                    {
                        route: '/goodid',
                        text: 'GoodID',
                        show: isWhitelisted,
                    },
                    {
                        route: '/dashboard',
                        text: 'Dashboard',
                        show: true,
                    },
                ],
            },
        ],
        [isWhitelisted, pathname]
    )

    return (
        <View
            flexDirection="column"
            backgroundColor={bgContainer}
            justifyContent="space-between"
            style={containerStyles}
        >
            <Box
                display="flex"
                w={scrWidth}
                h="100%"
                justifyContent="center"
                flexDirection="column"
                px="6"
                paddingRight="2"
                py="4"
                bg={bgContainer}
            >
                <ScrollView scrollEnabled={true} display="flex" flexDir="column">
                    {internalLinks.concat(externalLinks).map((subMenu, i) =>
                        !subMenu.subMenuTitle || subMenu.subMenuTitle === 'Regular' ? (
                            <SubMenuItems
                                key={i}
                                items={subMenu.items}
                                handleExternal={handleExternal}
                                handleInternal={onTabClick}
                            />
                        ) : (
                            <SlideDownTab
                                key={i}
                                tabTitle={subMenu.subMenuTitle}
                                viewInteraction={{
                                    hover: { backgroundColor: 'main:alpha.10', borderRadius: 6 },
                                }}
                                styles={{
                                    button: {
                                        borderRadius: 12,
                                    },
                                    innerButton: {
                                        height: '10',
                                    },
                                    content: { alignItems: 'flex-start' },
                                    titleFont: {
                                        fontFamily: 'subheading',
                                        fontWeight: '400',
                                        paddingLeft: 2,
                                    },
                                }}
                                arrowSmall
                            >
                                <View pl={2}>
                                    <SubMenuItems
                                        items={subMenu.items}
                                        // styles={{ alignItems: 'flex-start' }}
                                        handleExternal={handleExternal}
                                        handleInternal={onTabClick}
                                    />
                                </View>
                            </SlideDownTab>
                        )
                    )}
                </ScrollView>
                <div className={footerStyles}>
                    <div className="flex flex-row w-full h-6 gap-10">
                        <div className="flex items-center justify-center">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 29 29"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-shrink-0 cursor-pointer select-none"
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            >
                                {theme === 'dark' ? (
                                    <path
                                        d="M24.7564 10.2564V4.24359H18.7436L14.5 0L10.2564 4.24359H4.24359V10.2564L0 14.5L4.24359 18.7436V24.7564H10.2564L14.5 29L18.7436 24.7564H24.7564V18.7436L29 14.5L24.7564 10.2564ZM14.5 22.1923C10.2564 22.1923 6.80769 18.7436 6.80769 14.5C6.80769 10.2564 10.2564 6.80769 14.5 6.80769C18.7436 6.80769 22.1923 10.2564 22.1923 14.5C22.1923 18.7436 18.7436 22.1923 14.5 22.1923ZM14.5 9.37179C11.6667 9.37179 9.37179 11.6667 9.37179 14.5C9.37179 17.3333 11.6667 19.6282 14.5 19.6282C17.3333 19.6282 19.6282 17.3333 19.6282 14.5C19.6282 11.6667 17.3333 9.37179 14.5 9.37179Z"
                                        fill="#00B0FF"
                                    />
                                ) : (
                                    <path
                                        d="M24.1667 18.4996L28.1662 14.5L24.1667 10.5004V4.83332H18.4996L14.5 0.83374L10.5004 4.83332H4.83332V10.5004L0.83374 14.5L4.83332 18.4996V24.1667H10.5004L14.5 28.1662L18.4996 24.1667H24.1667V18.4996ZM14.5 21.75V7.24999C18.4996 7.24999 21.75 10.5004 21.75 14.5C21.75 18.4996 18.4996 21.75 14.5 21.75Z"
                                        fill="#00B0FF"
                                    />
                                )}
                            </svg>
                        </div>
                        <LanguageSwitch />
                    </div>
                    <Box
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="justify-start"
                        borderTopWidth={1}
                        borderTopColor="borderGrey"
                        pt={4}
                        pl={1}
                    >
                        <HStack space={15} justifyContent="space-between" width="100%">
                            {firstRowItems.map(([key, { icon, url }]) => (
                                <SocialsLink key={key} network={key} logo={icon} url={url} onPress={handleExternal} />
                            ))}
                        </HStack>
                        <HStack space={15} mt={4} justifyContent="space-between" width="100%">
                            {secondRowItems.map(([key, { icon, url }]) => (
                                <SocialsLink key={key} network={key} logo={icon} url={url} onPress={handleExternal} />
                            ))}
                        </HStack>
                    </Box>
                    <Box mt="2">
                        <ExternalLink
                            label="Privacy Policy"
                            url="https://www.gooddollar.org/privacy-policy"
                            dataAttr="privacy"
                            withDefaultStyles={true}
                            customStyles={externalPrivacyStyles}
                            onPress={handleExternal}
                        />
                        <ExternalLink
                            label="Terms and Conditions"
                            url="https://www.gooddollar.org/terms-of-use"
                            dataAttr="terms"
                            withDefaultStyles={true}
                            customStyles={externalPrivacyStyles}
                            onPress={handleExternal}
                        />
                    </Box>
                </div>
            </Box>
        </View>
    )
}
