# Core packages
import os
import functools
from distutils.util import strtobool

# Third party packages
import flask
from webapp.login import user_info


def login_required(func):
    """
    Decorator that checks if a user is logged in, and redirects
    to login page if not.
    """

    @functools.wraps(func)
    def is_user_logged_in(*args, **kwargs):
        if not user_info(flask.session):
            return flask.redirect("/login?next=" + flask.request.path)

        return func(*args, **kwargs)

    return is_user_logged_in


def advantage_checks(check_list=None):
    if check_list is None:
        check_list = []

    def advantage_checks_decorator(func):
        @functools.wraps(func)
        def check_advantage(*args, **kwargs):
            if "is_maintenance":
                if strtobool(os.getenv("STORE_MAINTENANCE", "false")):
                    return flask.render_template("advantage/maintenance.html")

            is_test_backend = flask.request.args.get("test_backend", False)

            stripe_publishable_key = os.getenv(
                "STRIPE_LIVE_PUBLISHABLE_KEY",
                "pk_live_68aXqowUeX574aGsVck8eiIE",
            )

            api_url = flask.current_app.config["CONTRACTS_LIVE_API_URL"]

            if is_test_backend:
                stripe_publishable_key = os.getenv(
                    "STRIPE_TEST_PUBLISHABLE_KEY",
                    "pk_test_yndN9H0GcJffPe0W58Nm64cM00riYG4N46",
                )
                api_url = flask.current_app.config["CONTRACTS_TEST_API_URL"]

            user_token = flask.session.get("authentication_token")
            guest_token = flask.session.get("guest_authentication_token")
            has_user = user_info(flask.session)
            url_ending = "?test_backend=true" if is_test_backend else ""

            kwargs["test_backend"] = is_test_backend
            kwargs["api_url"] = api_url
            kwargs["stripe_publishable_key"] = stripe_publishable_key
            kwargs["token"] = user_token or guest_token
            kwargs["token_type"] = "Macaroon" if user_token else "Bearer"

            if "view_need_user" in check_list and not has_user:
                if flask.request.path != "/advantage":
                    return flask.redirect(f"/advantage{url_ending}")

                return flask.render_template(
                    "advantage/index-no-login.html",
                    is_test_backend=is_test_backend,
                )

            if "need_guest_trial" in check_list:
                if not flask.session.get("guest_trial"):
                    return flask.redirect(f"/advantage{url_ending}")

            if "check_for_guest_trials" in check_list:
                if has_user and flask.session.get("guest_trial"):
                    return flask.redirect(
                        f"/advantage/save-guest-trial{url_ending}"
                    )

            if "need_user" in check_list:
                if not has_user:
                    return (
                        flask.jsonify({"error": "authentication required"}),
                        401,
                    )

            if "need_user_or_guest" in check_list:
                if not has_user and not guest_token:
                    return (
                        flask.jsonify({"error": "authentication required"}),
                        401,
                    )

            return func(*args, **kwargs)

        return check_advantage

    return advantage_checks_decorator
