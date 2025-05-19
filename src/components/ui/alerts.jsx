function Alert({ submitSuccess, submitError }) {
    return (
        <>
            {submitSuccess && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md justify-center flex flex-row gap-3">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAACD0lEQVR4nM1WP2sUURBfxUYtlLuZ29MIGtCIqI2iXpKZXVDyCQRLK0kl2CiWv9m9CKLoJzBWBr9AJCkULGy0sPZPpxwm2PgRZDZncuutm93jOBxYHvvezO838968mRcE/4sQZJGgzznR603MHfWRIc8IemssBAw1hn4ii+4QZJ0hv3z0fzb9zKbJqMB32eQNmfxgk/ftB8JFej7v665H0NduV5EgPkmQjVYSLTSWOlNVbBpLnSnXdztKo1O7GhDkkX+VPKpti3gfQ1IPPezqdDCChF2dzrYYkjrekAJDVtnkFSNu1wJO588y9PYOTtzewpHVIpIvBJmp5TqCvQR95yk+ON1M50575hWRfGgm0aU6HORpDH0bBMGewfkwkSuedTnl8PHCQTbtNdLoTFWCEPEJMvlZFL3jON4RXDywE4VpwpAXtaKArLPJ/X+ts8mKX+RBkp6H+Leib1+7O3t8CADzNxnysTCDclumvXwkJisF3i4y5Fsrjc5vG2O2lV066IWySLNIBktO2ZkQoht90Kjv0EuCPiwj+HMmjls5u5rQq2S6ydCnnurHnnT2l5JALzve0AKZfC2rOyHic2zyvZXItTKCDAsy486MdOMPIT68G0HpjZ9I7ZpMFZ5kP8l1RshGtc6om67PpveCUWSr5PR7vOla1uNN17Z7vO//OMRfJWy6nHutmC6P7bUyDvkNKEfqWvhHuk8AAAAASUVORK5CYII=" alt="approval--v1" />
                    Cadastro realizado com sucesso!
                </div>
            )}

            {submitError && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md justify-center flex flex-row gap-3">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAACAklEQVR4nM2VPWsUURSGr4YECxGDrJmd970zICviICishaDBkErR0t+gKFj4ARYWltoo2hlbsdki1bpzzszCCoqVIKRSLKxU/PwJRs6SyCbuTHZ1FjxwOdxz732fe+6nc/+jdaIomShA6/XjQv7MyJMTAbScmxLytQJPzFu9cogCF4R8sercNgGeKXC+UkCn0dilwMfM+6N9YBgeUeBTL453VwYR8p6SS4MxJR8JcLcqQEPIr+04DjZA5ub2KvklDcMDVUA6Ql4raLsu5NN/AihwWsi3rSSZsXo7CGIl75i3usWt3fr9FeBVszmt5JsUOLMeS4EFJVfN/84mDM8q8G59IuNl4f1VJfPBWDoEspZxqsCVsQCdIKjZZit5aBRIFgQHhfy2+XCUZ0EuCXl/czwtgJgJ+UDIhyMBBDhsRzMPwz3jQNpRNCvkZ42i5ihZ9MT7i8Pa0hLI2thLAjy3p6cYAJwTYKXo8Uu9n+9DvJ8vfESBFdMZCujF8Q4F3iuwWDSJW85tt2UxXzLRRdMxvT8axfubAiwXDe73IRt2GfMo2lfaD1g2vQ3BLgkFvmfA/i0gp2y5zJf1s0ko8COv16PBwY+VvO22sFaSzJjAKLfb9Ey3X8mAY/Y32J/hKrRerbZTgA+59yeM+FLIrgA3Ki9k1/RtqS7bZk6qmH6VK1RovwChxwVUPK8h2QAAAABJRU5ErkJggg==" alt="error--v1"></img>{submitError}
                </div>
            )}
        </>
    );
}

export default Alert;